export type RegionName = 'Nordeste' | 'Norte' | 'Centro-Oeste' | 'Sudeste' | 'Sul' | 'Outras';

export interface RawCsvRow {
  'Carga programada'?: string;
  'Chegada Origem'?: string;
  'Saída Origem'?: string;
  'Previsão na unidade'?: string;
  'Chegada Terminal'?: string;
  'Chegada Unidade'?: string;
  'Saída Unidade'?: string;
  'Status'?: string;
  'Transportador'?: string;
  'Motorista'?: string;
  'Cavalo'?: string;
  'Carretas'?: string;
  'Fornecedor'?: string;
  'Unidade'?: string;
  'NF'?: string;
  'Palletes'?: string | number;
  'Observação'?: string;
  [key: string]: any;
}

export interface ProcessedVehicle {
  id: string; // Unique identifier: Cavalo or Motorista + Carreta
  cavalo: string;
  carretas: string;
  motorista: string;
  transportador: string;
  status: string;
  unidade: string;
  regiao: RegionName;
  cidade?: string;
  estado?: string;
  fornecedor: string;
  nf: string;
  palletes: number;
  cargaProgramada: string;
  chegadaOrigem: string;
  saidaOrigem: string;
  previsaoUnidade: string;
  chegadaTerminal: string;
  chegadaUnidade: string;
  saidaUnidade: string;
  observacao: string;
  isOportunidade: boolean;
  rowNumber: number;
  rawDate?: Date | null;
}

export interface FileMetadata {
  fileName: string;
  fileSize: number;
  totalRawRows: number;
  processedRows: number;
  excludedCount: number;
  lastUpdated: string;
}

export interface KpiSummary {
  totalVeiculos: number;
  totalOportunidades: number;
  totalUnidades: number;
  totalTransportadoras: number;
  totalPaletes: number;
  statusCount: Record<string, number>;
  regiaoCount: Record<RegionName, number>;
  transportadoraCount: Record<string, number>;
  unidadeCount: Record<string, number>;
}

export interface RegionDetailItem {
  unidade: string;
  transportador: string;
  quantidadeVeiculos: number;
  placas: string[];
}

export interface UnitDetailItem {
  placa: string;
  motorista: string;
  transportador: string;
  status: string;
  previsaoUnidade: string;
  chegadaUnidade: string;
  saidaUnidade: string;
}

export interface UnitLocation {
  code: string;
  name: string;
  lat: number;
  lng: number;
  region: RegionName;
  state: string;
}
