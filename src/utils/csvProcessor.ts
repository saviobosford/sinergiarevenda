import Papa from 'papaparse';
import {
  ProcessedVehicle,
  RawCsvRow,
  RegionName,
  FileMetadata,
  KpiSummary,
} from '../types';
import {
  NORDESTE_UNITS,
  NORTE_UNITS,
  CENTRO_OESTE_UNITS,
  EXCLUDED_STATUSES,
  EXCLUDED_CARRIERS,
  OPPORTUNITY_STATUSES,
} from './constants';
import { resolveLocationFromUnit } from './cityGeocoding';

/**
 * Extracts discharge location or unit flexibly from the CSV row.
 * Respects: "levar em consideração o local de descarga a coluna Unidade"
 * Handles "Local de descarga", "Local Descarga", "Unidade de descarga", "Unidade", etc.
 */
export function extractDischargeLocation(row: RawCsvRow): string {
  if (!row || typeof row !== 'object') return '';

  const candidates = [
    'Local de descarga',
    'Local de Descarga',
    'Local Descarga',
    'Local descarga',
    'LOCAL DE DESCARGA',
    'LOCAL DESCARGA',
    'Local de Entrega',
    'Local de entrega',
    'Local Entrega',
    'Unidade de descarga',
    'Unidade de Descarga',
    'Unidade Descarga',
    'UNIDADE DE DESCARGA',
    'Unidade',
    'UNIDADE',
    'unidade',
    'Unidade Destino',
    'Unidade destino',
    'Destino',
    'DESTINO',
    'Filial',
    'FILIAL',
  ];

  for (const field of candidates) {
    if (row[field] !== undefined && row[field] !== null) {
      const val = String(row[field]).trim();
      if (val) return val;
    }
  }

  // Fallback: search row keys ignoring case and accents
  const keys = Object.keys(row);
  for (const key of keys) {
    const norm = key
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (
      norm.includes('descarga') ||
      norm.includes('unidade') ||
      norm.includes('destino') ||
      norm.includes('entrega')
    ) {
      const val = row[key];
      if (val !== undefined && val !== null) {
        const strVal = String(val).trim();
        if (strVal) return strVal;
      }
    }
  }

  return '';
}

/**
 * Classifies region based on the discharge location and city before the dash.
 * "verificar a verdadeira região de acordo com o nome da localização da cidade informada na informação antes do traço."
 */
export function classifyRegion(unitRaw: string): RegionName {
  if (!unitRaw) return 'Outras';
  const resolved = resolveLocationFromUnit(unitRaw);
  return resolved.region;
}

/**
 * Parses date string in Brazilian formats (DD/MM/YYYY, DD/MM/YYYY HH:mm, or ISO)
 */
export function parseDateTime(dateStr?: string): Date | null {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const str = dateStr.trim();
  if (!str) return null;

  // DD/MM/YYYY or DD/MM/YYYY HH:mm(:ss)
  const brMatch = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?$/);
  if (brMatch) {
    const day = parseInt(brMatch[1], 10);
    const month = parseInt(brMatch[2], 10) - 1;
    const year = parseInt(brMatch[3], 10);
    const hour = brMatch[4] ? parseInt(brMatch[4], 10) : 0;
    const minute = brMatch[5] ? parseInt(brMatch[5], 10) : 0;
    const second = brMatch[6] ? parseInt(brMatch[6], 10) : 0;
    return new Date(year, month, day, hour, minute, second);
  }

  const iso = new Date(str);
  if (!isNaN(iso.getTime())) return iso;

  return null;
}

/**
 * Checks if a vehicle has already finalized operational stages relative to browser current date.
 * Filter temporal:
 * const hoje = new Date();
 * Não exibir veículos que já finalizaram suas etapas operacionais.
 */
export function isOperationFinalized(row: RawCsvRow, hoje: Date): boolean {
  const statusNorm = (row.Status || '').trim().toLowerCase();
  if (EXCLUDED_STATUSES.has(statusNorm)) return true;

  // Check Saída Unidade: if saída da unidade is filled and timestamp <= hoje, operational steps have completed
  const saidaUnidade = (row['Saída Unidade'] || '').trim();
  if (saidaUnidade) {
    const saidaDate = parseDateTime(saidaUnidade);
    if (saidaDate && saidaDate.getTime() <= hoje.getTime()) {
      return true;
    }
  }

  return false;
}

export interface ParseResult {
  vehicles: ProcessedVehicle[];
  metadata: FileMetadata;
  kpis: KpiSummary;
}

export function processCsvContent(
  csvText: string,
  fileName: string = 'planilha.csv',
  fileSize: number = 0
): ParseResult {
  const hoje = new Date();

  // Auto-detect or parse with semicolon priority
  const parseResult = Papa.parse<RawCsvRow>(csvText, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header: string) => header.trim(),
  });

  const rawRows = parseResult.data;
  let excludedCount = 0;

  // Map to deduplicate vehicles:
  // Key: Cavalo (or Motorista + Carreta if Cavalo is empty)
  // If same vehicle appears multiple times, keep latest valid status
  const vehicleMap = new Map<string, ProcessedVehicle>();

  rawRows.forEach((row, index) => {
    // 1. Exclude Status = Finalizado, Sinistro, Cancelado
    const statusRaw = (row.Status || '').trim();
    const statusLower = statusRaw.toLowerCase();
    if (EXCLUDED_STATUSES.has(statusLower)) {
      excludedCount++;
      return;
    }

    // 2. Exclude Transportador = BRADO (case-insensitive)
    const transportadorRaw = (row.Transportador || '').trim();
    const transportadorLower = transportadorRaw.toLowerCase();
    if (EXCLUDED_CARRIERS.has(transportadorLower) || transportadorLower.includes('brado')) {
      excludedCount++;
      return;
    }

    // 3. Temporal Filter: Não exibir veículos que já finalizaram suas etapas operacionais
    if (isOperationFinalized(row, hoje)) {
      excludedCount++;
      return;
    }

    // 4. Vehicle identification:
    // Primary: Cavalo
    // Fallback: Motorista + Carretas
    const cavalo = (row.Cavalo || '').trim().toUpperCase();
    const motorista = (row.Motorista || '').trim();
    const carretas = (row.Carretas || '').trim().toUpperCase();

    let vehicleId = cavalo;
    if (!vehicleId) {
      vehicleId = `${motorista}_${carretas}`.trim();
    }
    if (!vehicleId || vehicleId === '_') {
      // Fallback row ID if all empty
      vehicleId = `VEICULO_LINHA_${index + 1}`;
    }

    // 5. Regionalization and Discharge Location
    // As requested: "levar em consideração o local de descarga a coluna Unidade e verificar a verdadeira região de acordo com o nome da localização da cidade informada na informação antes do traço"
    const unidadeRaw = extractDischargeLocation(row);
    const locationResolved = resolveLocationFromUnit(unidadeRaw);
    const unidade = unidadeRaw || locationResolved.displayName || 'N/D';
    const regiao = locationResolved.region;

    // 6. Opportunities calculation
    const isOportunidade = OPPORTUNITY_STATUSES.has(statusLower);

    // Palletes parsing
    let palletes = 0;
    if (row.Palletes !== undefined && row.Palletes !== null) {
      const pStr = String(row.Palletes).replace(/[^\d.,]/g, '').replace(',', '.');
      palletes = parseFloat(pStr) || 0;
    }

    const processed: ProcessedVehicle = {
      id: vehicleId,
      cavalo: cavalo || '(Sem Cavalo)',
      carretas: carretas || '-',
      motorista: motorista || 'Não informado',
      transportador: transportadorRaw || 'Não informado',
      status: statusRaw || 'Em Trânsito',
      unidade: unidade || 'N/D',
      regiao,
      cidade: locationResolved.city,
      estado: locationResolved.state,
      fornecedor: (row.Fornecedor || '-').trim(),
      nf: (row.NF || '-').trim(),
      palletes,
      cargaProgramada: (row['Carga programada'] || '-').trim(),
      chegadaOrigem: (row['Chegada Origem'] || '-').trim(),
      saidaOrigem: (row['Saída Origem'] || '-').trim(),
      previsaoUnidade: (row['Previsão na unidade'] || '-').trim(),
      chegadaTerminal: (row['Chegada Terminal'] || '-').trim(),
      chegadaUnidade: (row['Chegada Unidade'] || '-').trim(),
      saidaUnidade: (row['Saída Unidade'] || '-').trim(),
      observacao: (row['Observação'] || '-').trim(),
      isOportunidade,
      rowNumber: index + 1,
      rawDate: parseDateTime(row['Previsão na unidade'] || row['Carga programada'] || row['Chegada Unidade']),
    };

    // Deduplication rule: If the same vehicle appears more than once, show only the latest valid status.
    // By re-setting in map, subsequent occurrences overwrite previous ones, preserving the latest row.
    vehicleMap.set(vehicleId, processed);
  });

  const vehicles = Array.from(vehicleMap.values());

  // Calculate KPIs
  const kpis = calculateKpis(vehicles);

  const now = new Date();
  const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateFormatted = now.toLocaleDateString('pt-BR');

  const metadata: FileMetadata = {
    fileName,
    fileSize,
    totalRawRows: rawRows.length,
    processedRows: vehicles.length,
    excludedCount: excludedCount + (rawRows.length - vehicles.length - excludedCount),
    lastUpdated: `${dateFormatted} às ${timeFormatted}`,
  };

  return {
    vehicles,
    metadata,
    kpis,
  };
}

export function calculateKpis(vehicles: ProcessedVehicle[]): KpiSummary {
  const statusCount: Record<string, number> = {};
  const regiaoCount: Record<RegionName, number> = {
    Nordeste: 0,
    Norte: 0,
    'Centro-Oeste': 0,
    Sudeste: 0,
    Sul: 0,
    Outras: 0,
  };
  const transportadoraCount: Record<string, number> = {};
  const unidadeCount: Record<string, number> = {};

  let totalOportunidades = 0;
  let totalPaletes = 0;

  vehicles.forEach(v => {
    // Status count
    const st = v.status || 'Outro';
    statusCount[st] = (statusCount[st] || 0) + 1;

    // Region count
    regiaoCount[v.regiao] = (regiaoCount[v.regiao] || 0) + 1;

    // Carrier count
    const tr = v.transportador || 'Outro';
    transportadoraCount[tr] = (transportadoraCount[tr] || 0) + 1;

    // Unit count
    const un = v.unidade || 'N/D';
    unidadeCount[un] = (unidadeCount[un] || 0) + 1;

    // Opportunities
    if (v.isOportunidade) {
      totalOportunidades++;
    }

    totalPaletes += v.palletes;
  });

  return {
    totalVeiculos: vehicles.length,
    totalOportunidades,
    totalUnidades: Object.keys(unidadeCount).length,
    totalTransportadoras: Object.keys(transportadoraCount).length,
    totalPaletes,
    statusCount,
    regiaoCount,
    transportadoraCount,
    unidadeCount,
  };
}
