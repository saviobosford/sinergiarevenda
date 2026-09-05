import { RegionName, UnitLocation } from '../types';

export const NORDESTE_UNITS = new Set([
  'FFOR', // Fortaleza - CE
  'FSLZ', // São Luís - MA
  'FTHE', // Teresina - PI
  'FJPA', // João Pessoa - PB
  'FSSA', // Salvador - BA
  'FSUA', // Suape/Recife - PE
  'FMCZ', // Maceió - AL
  'CNAT', // Natal - RN
  'CAJU', // Aracaju - SE
]);

export const NORTE_UNITS = new Set([
  'FBLM', // Belém - PA
  'FPVH', // Porto Velho - RO
  'FMAO', // Manaus - AM
  'RCBC', // Barcarena - PA
  'CSAN', // Santarém - PA
  'CARA', // Araguaína - TO
]);

export const CENTRO_OESTE_UNITS = new Set([
  'FVAG', // Várzea Grande/Cuiabá - MT
  'CGR',  // Campo Grande - MS
  'GYN',  // Goiânia - GO
  'BSB',  // Brasília - DF
  'RVD',  // Rio Verde - GO
  'RNO',  // Rondonópolis - MT
]);

// Known units coordinates for Leaflet Map
export const UNIT_COORDINATES: Record<string, UnitLocation> = {
  // Nordeste
  FFOR: { code: 'FFOR', name: 'Fortaleza (CE)', lat: -3.7319, lng: -38.5267, region: 'Nordeste', state: 'CE' },
  FSLZ: { code: 'FSLZ', name: 'São Luís (MA)', lat: -2.5307, lng: -44.3068, region: 'Nordeste', state: 'MA' },
  FTHE: { code: 'FTHE', name: 'Teresina (PI)', lat: -5.0920, lng: -42.8038, region: 'Nordeste', state: 'PI' },
  FJPA: { code: 'FJPA', name: 'João Pessoa (PB)', lat: -7.1195, lng: -34.8450, region: 'Nordeste', state: 'PB' },
  FSSA: { code: 'FSSA', name: 'Salvador (BA)', lat: -12.9777, lng: -38.5016, region: 'Nordeste', state: 'BA' },
  FSUA: { code: 'FSUA', name: 'Suape / Ipojuca (PE)', lat: -8.3986, lng: -34.9667, region: 'Nordeste', state: 'PE' },
  FMCZ: { code: 'FMCZ', name: 'Maceió (AL)', lat: -9.6498, lng: -35.7089, region: 'Nordeste', state: 'AL' },
  CNAT: { code: 'CNAT', name: 'Natal (RN)', lat: -5.7945, lng: -35.2110, region: 'Nordeste', state: 'RN' },
  CAJU: { code: 'CAJU', name: 'Aracaju (SE)', lat: -10.9472, lng: -37.0731, region: 'Nordeste', state: 'SE' },

  // Norte
  FBLM: { code: 'FBLM', name: 'Belém (PA)', lat: -1.4558, lng: -48.4902, region: 'Norte', state: 'PA' },
  FPVH: { code: 'FPVH', name: 'Porto Velho (RO)', lat: -8.7619, lng: -63.9039, region: 'Norte', state: 'RO' },
  FMAO: { code: 'FMAO', name: 'Manaus (AM)', lat: -3.1190, lng: -60.0217, region: 'Norte', state: 'AM' },
  RCBC: { code: 'RCBC', name: 'Barcarena (PA)', lat: -1.5058, lng: -48.6698, region: 'Norte', state: 'PA' },
  CSAN: { code: 'CSAN', name: 'Santarém (PA)', lat: -2.4431, lng: -54.7083, region: 'Norte', state: 'PA' },
  CARA: { code: 'CARA', name: 'Araguaína (TO)', lat: -7.1917, lng: -48.2072, region: 'Norte', state: 'TO' },

  // Centro-Oeste
  FVAG: { code: 'FVAG', name: 'Várzea Grande / Cuiabá (MT)', lat: -15.6508, lng: -56.1325, region: 'Centro-Oeste', state: 'MT' },
  CGR: { code: 'CGR', name: 'Campo Grande (MS)', lat: -20.4697, lng: -54.6201, region: 'Centro-Oeste', state: 'MS' },
  GYN: { code: 'GYN', name: 'Goiânia (GO)', lat: -16.6869, lng: -49.2648, region: 'Centro-Oeste', state: 'GO' },
  BSB: { code: 'BSB', name: 'Brasília (DF)', lat: -15.7975, lng: -47.8919, region: 'Centro-Oeste', state: 'DF' },
  RVD: { code: 'RVD', name: 'Rio Verde (GO)', lat: -17.7925, lng: -50.9192, region: 'Centro-Oeste', state: 'GO' },
  RNO: { code: 'RNO', name: 'Rondonópolis (MT)', lat: -16.4674, lng: -54.6367, region: 'Centro-Oeste', state: 'MT' },

  // Sudeste (SP, RJ, MG, ES)
  SPO: { code: 'SPO', name: 'São Paulo (SP)', lat: -23.5505, lng: -46.6333, region: 'Sudeste', state: 'SP' },
  CPQ: { code: 'CPQ', name: 'Campinas (SP)', lat: -22.9099, lng: -47.0626, region: 'Sudeste', state: 'SP' },
  SSZ: { code: 'SSZ', name: 'Santos (SP)', lat: -23.9608, lng: -46.3336, region: 'Sudeste', state: 'SP' },
  SJC: { code: 'SJC', name: 'São José dos Campos (SP)', lat: -23.2237, lng: -45.9009, region: 'Sudeste', state: 'SP' },
  RAO: { code: 'RAO', name: 'Ribeirão Preto (SP)', lat: -21.1767, lng: -47.8208, region: 'Sudeste', state: 'SP' },
  RIO: { code: 'RIO', name: 'Rio de Janeiro (RJ)', lat: -22.9068, lng: -43.1729, region: 'Sudeste', state: 'RJ' },
  DUQ: { code: 'DUQ', name: 'Duque de Caxias (RJ)', lat: -22.7856, lng: -43.3117, region: 'Sudeste', state: 'RJ' },
  BHZ: { code: 'BHZ', name: 'Belo Horizonte / Betim (MG)', lat: -19.9208, lng: -43.9378, region: 'Sudeste', state: 'MG' },
  UBA: { code: 'UBA', name: 'Uberlândia (MG)', lat: -18.9186, lng: -48.2772, region: 'Sudeste', state: 'MG' },
  VIX: { code: 'VIX', name: 'Vitória / Serra (ES)', lat: -20.3155, lng: -40.3128, region: 'Sudeste', state: 'ES' },

  // Sul (PR, SC, RS)
  CWB: { code: 'CWB', name: 'Curitiba / SJ Pinhais (PR)', lat: -25.4290, lng: -49.2671, region: 'Sul', state: 'PR' },
  PNG: { code: 'PNG', name: 'Paranaguá (PR)', lat: -25.5205, lng: -48.5095, region: 'Sul', state: 'PR' },
  LDB: { code: 'LDB', name: 'Londrina (PR)', lat: -23.3045, lng: -51.1696, region: 'Sul', state: 'PR' },
  FLN: { code: 'FLN', name: 'Florianópolis / São José (SC)', lat: -27.5954, lng: -48.5480, region: 'Sul', state: 'SC' },
  ITA: { code: 'ITA', name: 'Itajaí / Navegantes (SC)', lat: -26.9078, lng: -48.6619, region: 'Sul', state: 'SC' },
  JOI: { code: 'JOI', name: 'Joinville (SC)', lat: -26.3045, lng: -48.8487, region: 'Sul', state: 'SC' },
  POA: { code: 'POA', name: 'Porto Alegre / Canoas (RS)', lat: -30.0346, lng: -51.2177, region: 'Sul', state: 'RS' },
  CXJ: { code: 'CXJ', name: 'Caxias do Sul (RS)', lat: -29.1678, lng: -51.1794, region: 'Sul', state: 'RS' },
  RIG: { code: 'RIG', name: 'Rio Grande (RS)', lat: -32.0350, lng: -52.0986, region: 'Sul', state: 'RS' },
};

export const REGION_CENTERS: Record<RegionName, { lat: number; lng: number; zoom: number; color: string; bgClass: string; textClass: string; borderClass: string }> = {
  Nordeste: { lat: -7.5, lng: -39.0, zoom: 6, color: '#f97316', bgClass: 'bg-orange-500', textClass: 'text-orange-600', borderClass: 'border-orange-500' },
  Norte: { lat: -3.5, lng: -55.0, zoom: 5, color: '#10b981', bgClass: 'bg-emerald-500', textClass: 'text-emerald-600', borderClass: 'border-emerald-500' },
  'Centro-Oeste': { lat: -16.0, lng: -53.0, zoom: 6, color: '#eab308', bgClass: 'bg-amber-500', textClass: 'text-amber-600', borderClass: 'border-amber-500' },
  Sudeste: { lat: -21.5, lng: -45.0, zoom: 6, color: '#3b82f6', bgClass: 'bg-blue-500', textClass: 'text-blue-600', borderClass: 'border-blue-500' },
  Sul: { lat: -27.5, lng: -52.0, zoom: 6, color: '#8b5cf6', bgClass: 'bg-purple-500', textClass: 'text-purple-600', borderClass: 'border-purple-500' },
  Outras: { lat: -14.235, lng: -51.9253, zoom: 4, color: '#64748b', bgClass: 'bg-slate-500', textClass: 'text-slate-600', borderClass: 'border-slate-500' },
};

// Opportunity statuses per specification:
// "Considerar apenas registros com status: Programado, Aguarda carregamento, Em trânsito, Aguarda agenda, Aguarda descarga"
export const OPPORTUNITY_STATUSES = new Set([
  'programado',
  'aguarda carregamento',
  'aguardando carregamento',
  'em trânsito',
  'em transito',
  'aguarda agenda',
  'aguardando agenda',
  'aguarda descarga',
  'aguardando descarga',
]);

// Excluded statuses:
export const EXCLUDED_STATUSES = new Set([
  'finalizado',
  'sinistro',
  'cancelado',
]);

// Excluded carrier:
export const EXCLUDED_CARRIERS = new Set([
  'brado',
]);

export const CSV_EXPECTED_HEADERS = [
  'Carga programada',
  'Chegada Origem',
  'Saída Origem',
  'Previsão na unidade',
  'Chegada Terminal',
  'Chegada Unidade',
  'Saída Unidade',
  'Status',
  'Transportador',
  'Motorista',
  'Cavalo',
  'Carretas',
  'Fornecedor',
  'Unidade',
  'NF',
  'Palletes',
  'Observação',
];
