import { CSV_EXPECTED_HEADERS } from './constants';

export function generateSampleCsv(count: number = 180): string {
  const headers = CSV_EXPECTED_HEADERS.join(';');

  const carriers = [
    'JSL Logística',
    'Braspress Transportes',
    'Patrus Transportes',
    'Tegma Gestão Logística',
    'Direct Express',
    'RodoCargo Brasil',
    'TransSatélite',
    'BRADO', // To test exclusion
    'brado logística', // To test case-insensitive exclusion
    'Loggi Express',
    'Atlas Transportes',
  ];

  const drivers = [
    'Carlos Eduardo Silva',
    'Marcos Antônio Souza',
    'José Roberto Lima',
    'Antônio Carlos Ferreira',
    'Paulo Henrique Santos',
    'Francisco das Chagas',
    'Lucas Mendes Oliveira',
    'Rodrigo Almeida Costa',
    'Luiz Fernando Pereira',
    'Marcio Rogério Dias',
  ];

  // Include both city-dash-state formats and code formats
  const units = [
    // Nordeste
    'FORTALEZA - CE',
    'RECIFE - PE',
    'SALVADOR - BA',
    'SÃO LUÍS - MA',
    'TERESINA - PI',
    'JOÃO PESSOA - PB',
    'NATAL - RN',
    'MACEIÓ - AL',
    'ARACAJU - SE',
    'JABOATÃO DOS GUARARAPES - PE',
    'FFOR',
    'FSSA',
    'FSUA',

    // Norte
    'BELÉM - PA',
    'MANAUS - AM',
    'PORTO VELHO - RO',
    'SANTARÉM - PA',
    'PALMAS - TO',
    'FBLM',
    'FMAO',

    // Centro-Oeste
    'VÁRZEA GRANDE - MT',
    'CUIABÁ - MT',
    'GOIÂNIA - GO',
    'BRASÍLIA - DF',
    'CAMPO GRANDE - MS',
    'RONDONÓPOLIS - MT',
    'RIO VERDE - GO',
    'FVAG',
    'GYN',

    // Sudeste
    'SÃO PAULO - SP',
    'CAMPINAS - SP',
    'RIO DE JANEIRO - RJ',
    'BELO HORIZONTE - MG',
    'UBERLÂNDIA - MG',
    'SANTOS - SP',
    'VITÓRIA - ES',
    'DUQUE DE CAXIAS - RJ',
    'SPO',
    'BHZ',

    // Sul
    'CURITIBA - PR',
    'PORTO ALEGRE - RS',
    'ITAJAÍ - SC',
    'FLORIANÓPOLIS - SC',
    'CAXIAS DO SUL - RS',
    'LONDRINA - PR',
    'JOINVILLE - SC',
    'CWB',
    'POA',
  ];

  const statuses = [
    'Programado',
    'Aguarda carregamento',
    'Em trânsito',
    'Aguarda agenda',
    'Aguarda descarga',
    'Finalizado', // To test exclusion
    'Cancelado',  // To test exclusion
    'Sinistro',   // To test exclusion
  ];

  const suppliers = [
    'Ambev S.A.',
    'Nestlé Brasil',
    'Unilever Brasil',
    'M. Dias Branco',
    'BRF Alimentos',
    'Bunge Brasil',
    'JBS Couros',
  ];

  const rows: string[] = [];
  const today = new Date();

  for (let i = 1; i <= count; i++) {
    const carrier = carriers[Math.floor(Math.random() * carriers.length)];
    const driver = drivers[Math.floor(Math.random() * drivers.length)];
    const unit = units[Math.floor(Math.random() * units.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];

    // Generate plate format ABC1D23 or ABC1234
    const plateLetters = String.fromCharCode(65 + (i % 26)) + String.fromCharCode(66 + ((i * 3) % 25)) + String.fromCharCode(67 + ((i * 7) % 24));
    const plateNum = String(1000 + (i * 17) % 8999);
    const cavalo = `${plateLetters}${plateNum.slice(0, 1)}${String.fromCharCode(65 + (i % 10))}${plateNum.slice(2)}`;
    const carretas = `SR-${plateLetters}${plateNum.slice(1)}`;

    const nf = `00${100000 + i}`;
    const palletes = 10 + (i % 28);

    // Dates
    const progDate = new Date(today.getTime() + (Math.random() * 4 - 2) * 86400000);
    const previsaoDate = new Date(progDate.getTime() + (Math.random() * 3 + 1) * 86400000);

    const fmtDate = (d: Date) => {
      const dd = String(d.getDate()).padStart(2, '0');
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const yyyy = d.getFullYear();
      const hh = String(d.getHours()).padStart(2, '0');
      const min = String(d.getMinutes()).padStart(2, '0');
      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    };

    const cargaProgramada = fmtDate(progDate);
    const chegadaOrigem = fmtDate(new Date(progDate.getTime() + 7200000));
    const saidaOrigem = fmtDate(new Date(progDate.getTime() + 14400000));
    const previsaoUnidade = fmtDate(previsaoDate);
    const chegadaTerminal = fmtDate(new Date(previsaoDate.getTime() - 10800000));
    const chegadaUnidade = status === 'Aguarda descarga' ? fmtDate(new Date()) : '';
    // Only set saída unidade for some, or future
    const saidaUnidade = status === 'Finalizado' ? fmtDate(new Date(today.getTime() - 3600000)) : '';

    const obs = `Operação Carga Lote #${1000 + i} - Prioridade Normal`;

    rows.push([
      cargaProgramada,
      chegadaOrigem,
      saidaOrigem,
      previsaoUnidade,
      chegadaTerminal,
      chegadaUnidade,
      saidaUnidade,
      status,
      carrier,
      driver,
      cavalo,
      carretas,
      supplier,
      unit,
      nf,
      palletes,
      obs,
    ].join(';'));
  }

  // Add deliberate duplicates to test deduplication:
  // Same Cavalo as row 1, but updated status 'Aguarda descarga'
  rows.push([
    '05/09/2026 08:00',
    '05/09/2026 09:30',
    '05/09/2026 11:00',
    '06/09/2026 14:00',
    '06/09/2026 13:00',
    '06/09/2026 13:30',
    '',
    'Aguarda descarga',
    'JSL Logística',
    'Carlos Eduardo Silva',
    rows[0].split(';')[10], // Duplicate Cavalo
    'SR-DUP001',
    'Ambev S.A.',
    'FFOR',
    '00999999',
    '28',
    'Atualização de status em tempo real (teste deduplicação)',
  ].join(';'));

  return `${headers}\n${rows.join('\n')}`;
}
