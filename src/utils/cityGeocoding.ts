import { RegionName, UnitLocation } from '../types';

export interface CityData {
  city: string; // Normalized uppercase without accents
  name: string; // Official display name
  state: string; // Two-letter UF
  region: RegionName;
  lat: number;
  lng: number;
}

// Map of Brazilian States to Macro-Regions (IBGE)
export const STATE_TO_REGION: Record<string, RegionName> = {
  // Nordeste (9 states)
  CE: 'Nordeste',
  PE: 'Nordeste',
  BA: 'Nordeste',
  MA: 'Nordeste',
  PB: 'Nordeste',
  RN: 'Nordeste',
  AL: 'Nordeste',
  PI: 'Nordeste',
  SE: 'Nordeste',

  // Norte (7 states)
  PA: 'Norte',
  AM: 'Norte',
  RO: 'Norte',
  TO: 'Norte',
  AC: 'Norte',
  AP: 'Norte',
  RR: 'Norte',

  // Centro-Oeste (3 states + DF)
  MT: 'Centro-Oeste',
  MS: 'Centro-Oeste',
  GO: 'Centro-Oeste',
  DF: 'Centro-Oeste',

  // Sudeste (4 states)
  SP: 'Sudeste',
  RJ: 'Sudeste',
  MG: 'Sudeste',
  ES: 'Sudeste',

  // Sul (3 states)
  PR: 'Sul',
  SC: 'Sul',
  RS: 'Sul',
};

// State centroid coordinates for fallback when only state is identified
export const STATE_CENTROIDS: Record<string, { lat: number; lng: number; name: string }> = {
  // Nordeste
  CE: { lat: -5.0, lng: -39.5, name: 'Ceará' },
  PE: { lat: -8.3, lng: -37.8, name: 'Pernambuco' },
  BA: { lat: -12.5, lng: -41.7, name: 'Bahia' },
  MA: { lat: -5.4, lng: -45.3, name: 'Maranhão' },
  PB: { lat: -7.1, lng: -36.8, name: 'Paraíba' },
  RN: { lat: -5.8, lng: -36.5, name: 'Rio Grande do Norte' },
  AL: { lat: -9.6, lng: -36.6, name: 'Alagoas' },
  PI: { lat: -7.7, lng: -42.7, name: 'Piauí' },
  SE: { lat: -10.6, lng: -37.4, name: 'Sergipe' },

  // Norte
  PA: { lat: -3.8, lng: -52.3, name: 'Pará' },
  AM: { lat: -4.0, lng: -64.6, name: 'Amazonas' },
  RO: { lat: -10.9, lng: -62.8, name: 'Rondônia' },
  TO: { lat: -10.2, lng: -48.3, name: 'Tocantins' },
  AC: { lat: -9.2, lng: -70.5, name: 'Acre' },
  AP: { lat: 1.4, lng: -51.9, name: 'Amapá' },
  RR: { lat: 2.1, lng: -61.4, name: 'Roraima' },

  // Centro-Oeste
  MT: { lat: -12.6, lng: -55.4, name: 'Mato Grosso' },
  MS: { lat: -20.5, lng: -54.5, name: 'Mato Grosso do Sul' },
  GO: { lat: -15.9, lng: -50.1, name: 'Goiás' },
  DF: { lat: -15.8, lng: -47.9, name: 'Distrito Federal' },

  // Sudeste
  SP: { lat: -22.2, lng: -48.8, name: 'São Paulo' },
  RJ: { lat: -22.3, lng: -42.9, name: 'Rio de Janeiro' },
  MG: { lat: -18.5, lng: -44.5, name: 'Minas Gerais' },
  ES: { lat: -19.6, lng: -40.6, name: 'Espírito Santo' },

  // Sul
  PR: { lat: -24.9, lng: -51.6, name: 'Paraná' },
  SC: { lat: -27.3, lng: -50.9, name: 'Santa Catarina' },
  RS: { lat: -29.8, lng: -53.8, name: 'Rio Grande do Sul' },
};

/**
 * Normalizes text: uppercase, trims, removes diacritics / accents
 */
export function normalizeCityName(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Authoritative list of key logistics cities, distribution centers, and hubs in Brazil.
 */
export const BRAZIL_CITIES: CityData[] = [
  // --- NORDESTE ---
  // Ceará
  { city: 'FORTALEZA', name: 'Fortaleza', state: 'CE', region: 'Nordeste', lat: -3.7319, lng: -38.5267 },
  { city: 'CAUCAIA', name: 'Caucaia', state: 'CE', region: 'Nordeste', lat: -3.7364, lng: -38.6531 },
  { city: 'MARACANAU', name: 'Maracanaú', state: 'CE', region: 'Nordeste', lat: -3.8767, lng: -38.6256 },
  { city: 'SOBRAL', name: 'Sobral', state: 'CE', region: 'Nordeste', lat: -3.6880, lng: -40.3497 },
  { city: 'JUAZEIRO DO NORTE', name: 'Juazeiro do Norte', state: 'CE', region: 'Nordeste', lat: -7.2132, lng: -39.3153 },
  { city: 'EUSEBIO', name: 'Eusébio', state: 'CE', region: 'Nordeste', lat: -3.8906, lng: -38.4528 },
  { city: 'AQUIRAZ', name: 'Aquiraz', state: 'CE', region: 'Nordeste', lat: -3.9014, lng: -38.3911 },
  { city: 'HORIZONTE', name: 'Horizonte', state: 'CE', region: 'Nordeste', lat: -4.0983, lng: -38.4878 },
  { city: 'CRATO', name: 'Crato', state: 'CE', region: 'Nordeste', lat: -7.2344, lng: -39.4094 },
  { city: 'IGUATU', name: 'Iguatu', state: 'CE', region: 'Nordeste', lat: -6.3589, lng: -39.2972 },

  // Pernambuco
  { city: 'RECIFE', name: 'Recife', state: 'PE', region: 'Nordeste', lat: -8.0476, lng: -34.8770 },
  { city: 'JABOATAO DOS GUARARAPES', name: 'Jaboatão dos Guararapes', state: 'PE', region: 'Nordeste', lat: -8.1130, lng: -35.0147 },
  { city: 'JABOATAO', name: 'Jaboatão dos Guararapes', state: 'PE', region: 'Nordeste', lat: -8.1130, lng: -35.0147 },
  { city: 'CABO DE SANTO AGOSTINHO', name: 'Cabo de Santo Agostinho', state: 'PE', region: 'Nordeste', lat: -8.2819, lng: -35.0336 },
  { city: 'SUAPE', name: 'Suape / Ipojuca', state: 'PE', region: 'Nordeste', lat: -8.3986, lng: -34.9667 },
  { city: 'IPOJUCA', name: 'Ipojuca', state: 'PE', region: 'Nordeste', lat: -8.3986, lng: -35.0639 },
  { city: 'OLINDA', name: 'Olinda', state: 'PE', region: 'Nordeste', lat: -7.9986, lng: -34.8459 },
  { city: 'CARUARU', name: 'Caruaru', state: 'PE', region: 'Nordeste', lat: -8.2839, lng: -35.9761 },
  { city: 'PETROLINA', name: 'Petrolina', state: 'PE', region: 'Nordeste', lat: -9.3891, lng: -40.5028 },
  { city: 'PAULISTA', name: 'Paulista', state: 'PE', region: 'Nordeste', lat: -7.9406, lng: -34.8731 },
  { city: 'GARANHUNS', name: 'Garanhuns', state: 'PE', region: 'Nordeste', lat: -8.8906, lng: -36.4928 },
  { city: 'VITORIA DE SANTO ANTAO', name: 'Vitória de Santo Antão', state: 'PE', region: 'Nordeste', lat: -8.1189, lng: -35.2928 },

  // Bahia
  { city: 'SALVADOR', name: 'Salvador', state: 'BA', region: 'Nordeste', lat: -12.9777, lng: -38.5016 },
  { city: 'FEIRA DE SANTANA', name: 'Feira de Santana', state: 'BA', region: 'Nordeste', lat: -12.2667, lng: -38.9667 },
  { city: 'CAMACARI', name: 'Camaçari', state: 'BA', region: 'Nordeste', lat: -12.6975, lng: -38.3242 },
  { city: 'LAURO DE FREITAS', name: 'Lauro de Freitas', state: 'BA', region: 'Nordeste', lat: -12.8944, lng: -38.3272 },
  { city: 'SIMOES FILHO', name: 'Simões Filho', state: 'BA', region: 'Nordeste', lat: -12.7878, lng: -38.4028 },
  { city: 'VITORIA DA CONQUISTA', name: 'Vitória da Conquista', state: 'BA', region: 'Nordeste', lat: -14.8661, lng: -40.8394 },
  { city: 'ITABUNA', name: 'Itabuna', state: 'BA', region: 'Nordeste', lat: -14.7856, lng: -39.2800 },
  { city: 'ILHEUS', name: 'Ilhéus', state: 'BA', region: 'Nordeste', lat: -14.7936, lng: -39.0458 },
  { city: 'JUAZEIRO', name: 'Juazeiro', state: 'BA', region: 'Nordeste', lat: -9.4167, lng: -40.5000 },
  { city: 'BARREIRAS', name: 'Barreiras', state: 'BA', region: 'Nordeste', lat: -12.1528, lng: -44.9961 },
  { city: 'LUIS EDUARDO MAGALHAES', name: 'Luís Eduardo Magalhães', state: 'BA', region: 'Nordeste', lat: -12.0953, lng: -45.7969 },
  { city: 'ALAGOINHAS', name: 'Alagoinhas', state: 'BA', region: 'Nordeste', lat: -12.1356, lng: -38.4236 },
  { city: 'JEQUIE', name: 'Jequié', state: 'BA', region: 'Nordeste', lat: -13.8578, lng: -40.0839 },
  { city: 'TEIXEIRA DE FREITAS', name: 'Teixeira de Freitas', state: 'BA', region: 'Nordeste', lat: -17.5344, lng: -39.7428 },
  { city: 'PORTO SEGURO', name: 'Porto Seguro', state: 'BA', region: 'Nordeste', lat: -16.4497, lng: -39.0647 },

  // Maranhão
  { city: 'SAO LUIS', name: 'São Luís', state: 'MA', region: 'Nordeste', lat: -2.5307, lng: -44.3068 },
  { city: 'IMPERATRIZ', name: 'Imperatriz', state: 'MA', region: 'Nordeste', lat: -5.5264, lng: -47.4772 },
  { city: 'SAO JOSE DE RIBAMAR', name: 'São José de Ribamar', state: 'MA', region: 'Nordeste', lat: -2.5622, lng: -44.0539 },
  { city: 'TIMON', name: 'Timon', state: 'MA', region: 'Nordeste', lat: -5.0939, lng: -42.8361 },
  { city: 'CAXIAS', name: 'Caxias', state: 'MA', region: 'Nordeste', lat: -4.8589, lng: -43.3561 },
  { city: 'ACAILANDIA', name: 'Açailândia', state: 'MA', region: 'Nordeste', lat: -4.9458, lng: -47.5028 },
  { city: 'BALSAS', name: 'Balsas', state: 'MA', region: 'Nordeste', lat: -7.5328, lng: -46.0356 },

  // Paraíba
  { city: 'JOAO PESSOA', name: 'João Pessoa', state: 'PB', region: 'Nordeste', lat: -7.1195, lng: -34.8450 },
  { city: 'CAMPINA GRANDE', name: 'Campina Grande', state: 'PB', region: 'Nordeste', lat: -7.2306, lng: -35.8811 },
  { city: 'CABEDELO', name: 'Cabedelo', state: 'PB', region: 'Nordeste', lat: -6.9811, lng: -34.8339 },
  { city: 'SANTA RITA', name: 'Santa Rita', state: 'PB', region: 'Nordeste', lat: -7.1139, lng: -34.9781 },
  { city: 'PATOS', name: 'Patos', state: 'PB', region: 'Nordeste', lat: -7.0256, lng: -37.2800 },
  { city: 'BAYEUX', name: 'Bayeux', state: 'PB', region: 'Nordeste', lat: -7.1250, lng: -34.9322 },

  // Rio Grande do Norte
  { city: 'NATAL', name: 'Natal', state: 'RN', region: 'Nordeste', lat: -5.7945, lng: -35.2110 },
  { city: 'MOSSORO', name: 'Mossoró', state: 'RN', region: 'Nordeste', lat: -5.1880, lng: -37.3442 },
  { city: 'PARNAMIRIM', name: 'Parnamirim', state: 'RN', region: 'Nordeste', lat: -5.9156, lng: -35.2628 },
  { city: 'SAO GONCALO DO AMARANTE', name: 'São Gonçalo do Amarante', state: 'RN', region: 'Nordeste', lat: -5.7928, lng: -35.3289 },

  // Alagoas
  { city: 'MACEIO', name: 'Maceió', state: 'AL', region: 'Nordeste', lat: -9.6498, lng: -35.7089 },
  { city: 'ARAPIRACA', name: 'Arapiraca', state: 'AL', region: 'Nordeste', lat: -9.7522, lng: -36.6606 },
  { city: 'RIO LARGO', name: 'Rio Largo', state: 'AL', region: 'Nordeste', lat: -9.4789, lng: -35.8450 },

  // Piauí
  { city: 'TERESINA', name: 'Teresina', state: 'PI', region: 'Nordeste', lat: -5.0920, lng: -42.8038 },
  { city: 'PARNAIBA', name: 'Parnaíba', state: 'PI', region: 'Nordeste', lat: -2.9042, lng: -41.7767 },
  { city: 'PICOS', name: 'Picos', state: 'PI', region: 'Nordeste', lat: -7.0769, lng: -41.4669 },
  { city: 'FLORIANO', name: 'Floriano', state: 'PI', region: 'Nordeste', lat: -6.7669, lng: -43.0225 },

  // Sergipe
  { city: 'ARACAJU', name: 'Aracaju', state: 'SE', region: 'Nordeste', lat: -10.9472, lng: -37.0731 },
  { city: 'NOSSA SENHORA DO SOCORRO', name: 'Nossa Senhora do Socorro', state: 'SE', region: 'Nordeste', lat: -10.8544, lng: -37.1261 },
  { city: 'ITABAIANA', name: 'Itabaiana', state: 'SE', region: 'Nordeste', lat: -10.6850, lng: -37.4253 },
  { city: 'ESTANCIA', name: 'Estância', state: 'SE', region: 'Nordeste', lat: -11.2683, lng: -37.4383 },

  // --- NORTE ---
  // Pará
  { city: 'BELEM', name: 'Belém', state: 'PA', region: 'Norte', lat: -1.4558, lng: -48.4902 },
  { city: 'ANANINDEUA', name: 'Ananindeua', state: 'PA', region: 'Norte', lat: -1.3656, lng: -48.3722 },
  { city: 'BARCARENA', name: 'Barcarena', state: 'PA', region: 'Norte', lat: -1.5058, lng: -48.6698 },
  { city: 'SANTAREM', name: 'Santarém', state: 'PA', region: 'Norte', lat: -2.4431, lng: -54.7083 },
  { city: 'MARABA', name: 'Marabá', state: 'PA', region: 'Norte', lat: -5.3686, lng: -49.1178 },
  { city: 'PARAUAPEBAS', name: 'Parauapebas', state: 'PA', region: 'Norte', lat: -6.0678, lng: -49.9022 },
  { city: 'CASTANHAL', name: 'Castanhal', state: 'PA', region: 'Norte', lat: -1.2956, lng: -47.9258 },
  { city: 'ALTAMIRA', name: 'Altamira', state: 'PA', region: 'Norte', lat: -3.2033, lng: -52.2064 },
  { city: 'PARAGOMINAS', name: 'Paragominas', state: 'PA', region: 'Norte', lat: -2.9972, lng: -47.3536 },
  { city: 'REDENCAO', name: 'Redenção', state: 'PA', region: 'Norte', lat: -8.0261, lng: -50.0322 },

  // Amazonas
  { city: 'MANAUS', name: 'Manaus', state: 'AM', region: 'Norte', lat: -3.1190, lng: -60.0217 },
  { city: 'ITACOATIARA', name: 'Itacoatiara', state: 'AM', region: 'Norte', lat: -3.1431, lng: -58.4442 },
  { city: 'PARINTINS', name: 'Parintins', state: 'AM', region: 'Norte', lat: -2.6289, lng: -56.7358 },

  // Rondônia
  { city: 'PORTO VELHO', name: 'Porto Velho', state: 'RO', region: 'Norte', lat: -8.7619, lng: -63.9039 },
  { city: 'JI PARANA', name: 'Ji-Paraná', state: 'RO', region: 'Norte', lat: -10.8847, lng: -61.9472 },
  { city: 'ARIQUEMES', name: 'Ariquemes', state: 'RO', region: 'Norte', lat: -9.9133, lng: -63.0408 },
  { city: 'VILHENA', name: 'Vilhena', state: 'RO', region: 'Norte', lat: -12.7406, lng: -60.1458 },
  { city: 'CACOAL', name: 'Cacoal', state: 'RO', region: 'Norte', lat: -11.4386, lng: -61.4472 },

  // Tocantins
  { city: 'PALMAS', name: 'Palmas', state: 'TO', region: 'Norte', lat: -10.1844, lng: -48.3336 },
  { city: 'ARAGUAINA', name: 'Araguaína', state: 'TO', region: 'Norte', lat: -7.1917, lng: -48.2072 },
  { city: 'GURUPI', name: 'Gurupi', state: 'TO', region: 'Norte', lat: -11.7297, lng: -49.0686 },
  { city: 'PORTO NACIONAL', name: 'Porto Nacional', state: 'TO', region: 'Norte', lat: -10.7081, lng: -48.4172 },

  // Acre, Amapá, Roraima
  { city: 'RIO BRANCO', name: 'Rio Branco', state: 'AC', region: 'Norte', lat: -9.9753, lng: -67.8249 },
  { city: 'CRUZEIRO DO SUL', name: 'Cruzeiro do Sul', state: 'AC', region: 'Norte', lat: -7.6311, lng: -72.6700 },
  { city: 'MACAPA', name: 'Macapá', state: 'AP', region: 'Norte', lat: 0.0389, lng: -51.0664 },
  { city: 'SANTANA', name: 'Santana', state: 'AP', region: 'Norte', lat: -0.0583, lng: -51.1817 },
  { city: 'BOA VISTA', name: 'Boa Vista', state: 'RR', region: 'Norte', lat: 2.8235, lng: -60.6758 },

  // --- CENTRO-OESTE ---
  // Mato Grosso
  { city: 'CUIABA', name: 'Cuiabá', state: 'MT', region: 'Centro-Oeste', lat: -15.6014, lng: -56.0979 },
  { city: 'VARZEA GRANDE', name: 'Várzea Grande', state: 'MT', region: 'Centro-Oeste', lat: -15.6508, lng: -56.1325 },
  { city: 'RONDONOPOLIS', name: 'Rondonópolis', state: 'MT', region: 'Centro-Oeste', lat: -16.4674, lng: -54.6367 },
  { city: 'SINOP', name: 'Sinop', state: 'MT', region: 'Centro-Oeste', lat: -11.8642, lng: -55.5053 },
  { city: 'SORRISO', name: 'Sorriso', state: 'MT', region: 'Centro-Oeste', lat: -12.5447, lng: -55.7236 },
  { city: 'LUCAS DO RIO VERDE', name: 'Lucas do Rio Verde', state: 'MT', region: 'Centro-Oeste', lat: -13.0608, lng: -55.9103 },
  { city: 'NOVA MUTUM', name: 'Nova Mutum', state: 'MT', region: 'Centro-Oeste', lat: -13.8294, lng: -56.0825 },
  { city: 'TANGARA DA SERRA', name: 'Tangará da Serra', state: 'MT', region: 'Centro-Oeste', lat: -14.6228, lng: -57.4933 },
  { city: 'PRIMAVERA DO LESTE', name: 'Primavera do Leste', state: 'MT', region: 'Centro-Oeste', lat: -15.5586, lng: -54.2967 },
  { city: 'BARRA DO GARCAS', name: 'Barra do Garças', state: 'MT', region: 'Centro-Oeste', lat: -15.8906, lng: -52.2567 },
  { city: 'CAMPO VERDE', name: 'Campo Verde', state: 'MT', region: 'Centro-Oeste', lat: -15.5450, lng: -55.1664 },

  // Goiás
  { city: 'GOIANIA', name: 'Goiânia', state: 'GO', region: 'Centro-Oeste', lat: -16.6869, lng: -49.2648 },
  { city: 'APARECIDA DE GOIANIA', name: 'Aparecida de Goiânia', state: 'GO', region: 'Centro-Oeste', lat: -16.8228, lng: -49.2481 },
  { city: 'ANAPOLIS', name: 'Anápolis', state: 'GO', region: 'Centro-Oeste', lat: -16.3267, lng: -48.9533 },
  { city: 'RIO VERDE', name: 'Rio Verde', state: 'GO', region: 'Centro-Oeste', lat: -17.7925, lng: -50.9192 },
  { city: 'ITUMBIARA', name: 'Itumbiara', state: 'GO', region: 'Centro-Oeste', lat: -18.4189, lng: -49.2150 },
  { city: 'JATAI', name: 'Jataí', state: 'GO', region: 'Centro-Oeste', lat: -17.8814, lng: -51.7144 },
  { city: 'CATALAO', name: 'Catalão', state: 'GO', region: 'Centro-Oeste', lat: -18.1706, lng: -47.9450 },
  { city: 'SENADOR CANEDO', name: 'Senador Canedo', state: 'GO', region: 'Centro-Oeste', lat: -16.7083, lng: -49.0917 },
  { city: 'LUZIANIA', name: 'Luziânia', state: 'GO', region: 'Centro-Oeste', lat: -16.2525, lng: -47.9500 },

  // Distrito Federal
  { city: 'BRASILIA', name: 'Brasília', state: 'DF', region: 'Centro-Oeste', lat: -15.7975, lng: -47.8919 },
  { city: 'TAGUATINGA', name: 'Taguatinga', state: 'DF', region: 'Centro-Oeste', lat: -15.8333, lng: -48.0567 },
  { city: 'CEILANDIA', name: 'Ceilândia', state: 'DF', region: 'Centro-Oeste', lat: -15.8206, lng: -48.1108 },

  // Mato Grosso do Sul
  { city: 'CAMPO GRANDE', name: 'Campo Grande', state: 'MS', region: 'Centro-Oeste', lat: -20.4697, lng: -54.6201 },
  { city: 'DOURADOS', name: 'Dourados', state: 'MS', region: 'Centro-Oeste', lat: -22.2211, lng: -54.8056 },
  { city: 'TRES LAGOAS', name: 'Três Lagoas', state: 'MS', region: 'Centro-Oeste', lat: -20.7511, lng: -51.6783 },
  { city: 'CORUMBA', name: 'Corumbá', state: 'MS', region: 'Centro-Oeste', lat: -19.0094, lng: -57.6533 },
  { city: 'PONTA PORA', name: 'Ponta Porã', state: 'MS', region: 'Centro-Oeste', lat: -22.5361, lng: -55.7256 },

  // --- SUDESTE ---
  // São Paulo
  { city: 'SAO PAULO', name: 'São Paulo', state: 'SP', region: 'Sudeste', lat: -23.5505, lng: -46.6333 },
  { city: 'SPO', name: 'São Paulo', state: 'SP', region: 'Sudeste', lat: -23.5505, lng: -46.6333 },
  { city: 'GUARULHOS', name: 'Guarulhos', state: 'SP', region: 'Sudeste', lat: -23.4542, lng: -46.5333 },
  { city: 'CAMPINAS', name: 'Campinas', state: 'SP', region: 'Sudeste', lat: -22.9099, lng: -47.0626 },
  { city: 'CPQ', name: 'Campinas', state: 'SP', region: 'Sudeste', lat: -22.9099, lng: -47.0626 },
  { city: 'SAO BERNARDO DO CAMPO', name: 'São Bernardo do Campo', state: 'SP', region: 'Sudeste', lat: -23.6944, lng: -46.5653 },
  { city: 'SANTO ANDRE', name: 'Santo André', state: 'SP', region: 'Sudeste', lat: -23.6639, lng: -46.5383 },
  { city: 'OSASCO', name: 'Osasco', state: 'SP', region: 'Sudeste', lat: -23.5325, lng: -46.7917 },
  { city: 'SANTOS', name: 'Santos', state: 'SP', region: 'Sudeste', lat: -23.9608, lng: -46.3336 },
  { city: 'SSZ', name: 'Santos', state: 'SP', region: 'Sudeste', lat: -23.9608, lng: -46.3336 },
  { city: 'SAO JOSE DOS CAMPOS', name: 'São José dos Campos', state: 'SP', region: 'Sudeste', lat: -23.2237, lng: -45.9009 },
  { city: 'SJC', name: 'São José dos Campos', state: 'SP', region: 'Sudeste', lat: -23.2237, lng: -45.9009 },
  { city: 'RIBEIRAO PRETO', name: 'Ribeirão Preto', state: 'SP', region: 'Sudeste', lat: -21.1767, lng: -47.8208 },
  { city: 'RAO', name: 'Ribeirão Preto', state: 'SP', region: 'Sudeste', lat: -21.1767, lng: -47.8208 },
  { city: 'SOROCABA', name: 'Sorocaba', state: 'SP', region: 'Sudeste', lat: -23.5017, lng: -47.4581 },
  { city: 'JUNDIAI', name: 'Jundiaí', state: 'SP', region: 'Sudeste', lat: -23.1856, lng: -46.8978 },
  { city: 'PIRACICABA', name: 'Piracicaba', state: 'SP', region: 'Sudeste', lat: -22.7253, lng: -47.6492 },
  { city: 'BAURU', name: 'Bauru', state: 'SP', region: 'Sudeste', lat: -22.3147, lng: -49.0606 },
  { city: 'SAO JOSE DO RIO PRETO', name: 'São José do Rio Preto', state: 'SP', region: 'Sudeste', lat: -20.8114, lng: -49.3758 },
  { city: 'SUMARE', name: 'Sumaré', state: 'SP', region: 'Sudeste', lat: -22.8208, lng: -47.2669 },
  { city: 'PAULINIA', name: 'Paulínia', state: 'SP', region: 'Sudeste', lat: -22.7611, lng: -47.1539 },
  { city: 'BARUERI', name: 'Barueri', state: 'SP', region: 'Sudeste', lat: -23.5106, lng: -46.8761 },
  { city: 'LOUVEIRA', name: 'Louveira', state: 'SP', region: 'Sudeste', lat: -23.0850, lng: -46.9511 },
  { city: 'CAJAMAR', name: 'Cajamar', state: 'SP', region: 'Sudeste', lat: -23.3556, lng: -46.8781 },
  { city: 'VALINHOS', name: 'Valinhos', state: 'SP', region: 'Sudeste', lat: -22.9706, lng: -46.9958 },
  { city: 'VINHEDO', name: 'Vinhedo', state: 'SP', region: 'Sudeste', lat: -23.0297, lng: -46.9747 },
  { city: 'TAUBATE', name: 'Taubaté', state: 'SP', region: 'Sudeste', lat: -23.0264, lng: -45.5553 },
  { city: 'LIMEIRA', name: 'Limeira', state: 'SP', region: 'Sudeste', lat: -22.5647, lng: -47.4017 },
  { city: 'AMERICANA', name: 'Americana', state: 'SP', region: 'Sudeste', lat: -22.7375, lng: -47.3331 },
  { city: 'INDAIATUBA', name: 'Indaiatuba', state: 'SP', region: 'Sudeste', lat: -23.0903, lng: -47.2181 },
  { city: 'HORTOLANDIA', name: 'Hortolândia', state: 'SP', region: 'Sudeste', lat: -22.8583, lng: -47.2200 },
  { city: 'ARARAQUARA', name: 'Araraquara', state: 'SP', region: 'Sudeste', lat: -21.7944, lng: -48.1758 },
  { city: 'MARILIA', name: 'Marília', state: 'SP', region: 'Sudeste', lat: -22.2139, lng: -49.9458 },
  { city: 'PRESIDENTE PRUDENTE', name: 'Presidente Prudente', state: 'SP', region: 'Sudeste', lat: -22.1256, lng: -51.3889 },
  { city: 'FRANCA', name: 'Franca', state: 'SP', region: 'Sudeste', lat: -20.5386, lng: -47.4008 },
  { city: 'RIO CLARO', name: 'Rio Claro', state: 'SP', region: 'Sudeste', lat: -22.4114, lng: -47.5614 },

  // Rio de Janeiro
  { city: 'RIO DE JANEIRO', name: 'Rio de Janeiro', state: 'RJ', region: 'Sudeste', lat: -22.9068, lng: -43.1729 },
  { city: 'RIO', name: 'Rio de Janeiro', state: 'RJ', region: 'Sudeste', lat: -22.9068, lng: -43.1729 },
  { city: 'DUQUE DE CAXIAS', name: 'Duque de Caxias', state: 'RJ', region: 'Sudeste', lat: -22.7856, lng: -43.3117 },
  { city: 'DUQ', name: 'Duque de Caxias', state: 'RJ', region: 'Sudeste', lat: -22.7856, lng: -43.3117 },
  { city: 'NITEROI', name: 'Niterói', state: 'RJ', region: 'Sudeste', lat: -22.8833, lng: -43.1036 },
  { city: 'SAO GONCALO', name: 'São Gonçalo', state: 'RJ', region: 'Sudeste', lat: -22.8269, lng: -43.0539 },
  { city: 'NOVA IGUACU', name: 'Nova Iguaçu', state: 'RJ', region: 'Sudeste', lat: -22.7558, lng: -43.4603 },
  { city: 'RESENDE', name: 'Resende', state: 'RJ', region: 'Sudeste', lat: -22.4689, lng: -44.4467 },
  { city: 'VOLTA REDONDA', name: 'Volta Redonda', state: 'RJ', region: 'Sudeste', lat: -22.5231, lng: -44.1042 },
  { city: 'MACAE', name: 'Macaé', state: 'RJ', region: 'Sudeste', lat: -22.3769, lng: -41.7869 },
  { city: 'CAMPOS DOS GOYTACAZES', name: 'Campos dos Goytacazes', state: 'RJ', region: 'Sudeste', lat: -21.7547, lng: -41.3244 },
  { city: 'ITABORAI', name: 'Itaboraí', state: 'RJ', region: 'Sudeste', lat: -22.7444, lng: -42.8594 },

  // Minas Gerais
  { city: 'BELO HORIZONTE', name: 'Belo Horizonte', state: 'MG', region: 'Sudeste', lat: -19.9208, lng: -43.9378 },
  { city: 'BHZ', name: 'Belo Horizonte', state: 'MG', region: 'Sudeste', lat: -19.9208, lng: -43.9378 },
  { city: 'BETIM', name: 'Betim', state: 'MG', region: 'Sudeste', lat: -19.9678, lng: -44.1983 },
  { city: 'CONTAGEM', name: 'Contagem', state: 'MG', region: 'Sudeste', lat: -19.9317, lng: -44.0536 },
  { city: 'UBERLANDIA', name: 'Uberlândia', state: 'MG', region: 'Sudeste', lat: -18.9186, lng: -48.2772 },
  { city: 'UBA', name: 'Uberlândia', state: 'MG', region: 'Sudeste', lat: -18.9186, lng: -48.2772 },
  { city: 'UBERABA', name: 'Uberaba', state: 'MG', region: 'Sudeste', lat: -19.7483, lng: -47.9319 },
  { city: 'JUIZ DE FORA', name: 'Juiz de Fora', state: 'MG', region: 'Sudeste', lat: -21.7642, lng: -43.3497 },
  { city: 'MONTES CLAROS', name: 'Montes Claros', state: 'MG', region: 'Sudeste', lat: -16.7350, lng: -43.8617 },
  { city: 'POUSO ALEGRE', name: 'Pouso Alegre', state: 'MG', region: 'Sudeste', lat: -22.2300, lng: -45.9364 },
  { city: 'EXTREMA', name: 'Extrema', state: 'MG', region: 'Sudeste', lat: -22.8547, lng: -46.3183 },
  { city: 'VARGINHA', name: 'Varginha', state: 'MG', region: 'Sudeste', lat: -21.5514, lng: -45.4300 },
  { city: 'POCOS DE CALDAS', name: 'Poços de Caldas', state: 'MG', region: 'Sudeste', lat: -21.7850, lng: -46.5625 },
  { city: 'GOVERNADOR VALADARES', name: 'Governador Valadares', state: 'MG', region: 'Sudeste', lat: -18.8511, lng: -41.9494 },
  { city: 'IPATINGA', name: 'Ipatinga', state: 'MG', region: 'Sudeste', lat: -19.4683, lng: -42.5367 },
  { city: 'SETE LAGOAS', name: 'Sete Lagoas', state: 'MG', region: 'Sudeste', lat: -19.4589, lng: -44.2467 },
  { city: 'DIVINOPOLIS', name: 'Divinópolis', state: 'MG', region: 'Sudeste', lat: -20.1439, lng: -44.8872 },

  // Espírito Santo
  { city: 'VITORIA', name: 'Vitória', state: 'ES', region: 'Sudeste', lat: -20.3155, lng: -40.3128 },
  { city: 'VIX', name: 'Vitória', state: 'ES', region: 'Sudeste', lat: -20.3155, lng: -40.3128 },
  { city: 'SERRA', name: 'Serra', state: 'ES', region: 'Sudeste', lat: -20.1286, lng: -40.3078 },
  { city: 'VILA VELHA', name: 'Vila Velha', state: 'ES', region: 'Sudeste', lat: -20.3297, lng: -40.2925 },
  { city: 'CARIACICA', name: 'Cariacica', state: 'ES', region: 'Sudeste', lat: -20.2639, lng: -40.4200 },
  { city: 'VIANA', name: 'Viana', state: 'ES', region: 'Sudeste', lat: -20.3906, lng: -40.4950 },
  { city: 'LINHARES', name: 'Linhares', state: 'ES', region: 'Sudeste', lat: -19.3911, lng: -40.0722 },
  { city: 'CACHOEIRO DE ITAPEMIRIM', name: 'Cachoeiro de Itapemirim', state: 'ES', region: 'Sudeste', lat: -20.8489, lng: -41.1128 },

  // --- SUL ---
  // Paraná
  { city: 'CURITIBA', name: 'Curitiba', state: 'PR', region: 'Sul', lat: -25.4290, lng: -49.2671 },
  { city: 'CWB', name: 'Curitiba', state: 'PR', region: 'Sul', lat: -25.4290, lng: -49.2671 },
  { city: 'SAO JOSE DOS PINHAIS', name: 'São José dos Pinhais', state: 'PR', region: 'Sul', lat: -25.5347, lng: -49.2064 },
  { city: 'PARANAGUA', name: 'Paranaguá', state: 'PR', region: 'Sul', lat: -25.5205, lng: -48.5095 },
  { city: 'PNG', name: 'Paranaguá', state: 'PR', region: 'Sul', lat: -25.5205, lng: -48.5095 },
  { city: 'LONDRINA', name: 'Londrina', state: 'PR', region: 'Sul', lat: -23.3045, lng: -51.1696 },
  { city: 'LDB', name: 'Londrina', state: 'PR', region: 'Sul', lat: -23.3045, lng: -51.1696 },
  { city: 'MARINGA', name: 'Maringá', state: 'PR', region: 'Sul', lat: -23.4205, lng: -51.9331 },
  { city: 'CASCAVEL', name: 'Cascavel', state: 'PR', region: 'Sul', lat: -24.9578, lng: -53.4597 },
  { city: 'PONTA GROSSA', name: 'Ponta Grossa', state: 'PR', region: 'Sul', lat: -25.0950, lng: -50.1619 },
  { city: 'FOZ DO IGUACU', name: 'Foz do Iguaçu', state: 'PR', region: 'Sul', lat: -25.5161, lng: -54.5853 },
  { city: 'ARAUCARIA', name: 'Araucária', state: 'PR', region: 'Sul', lat: -25.5928, lng: -49.3719 },
  { city: 'TOLEDO', name: 'Toledo', state: 'PR', region: 'Sul', lat: -24.7139, lng: -53.7431 },
  { city: 'GUARAPUAVA', name: 'Guarapuava', state: 'PR', region: 'Sul', lat: -25.3953, lng: -51.4581 },

  // Santa Catarina
  { city: 'FLORIANOPOLIS', name: 'Florianópolis', state: 'SC', region: 'Sul', lat: -27.5954, lng: -48.5480 },
  { city: 'FLN', name: 'Florianópolis', state: 'SC', region: 'Sul', lat: -27.5954, lng: -48.5480 },
  { city: 'ITAJAI', name: 'Itajaí', state: 'SC', region: 'Sul', lat: -26.9078, lng: -48.6619 },
  { city: 'ITA', name: 'Itajaí', state: 'SC', region: 'Sul', lat: -26.9078, lng: -48.6619 },
  { city: 'NAVEGANTES', name: 'Navegantes', state: 'SC', region: 'Sul', lat: -26.8978, lng: -48.6547 },
  { city: 'JOINVILLE', name: 'Joinville', state: 'SC', region: 'Sul', lat: -26.3045, lng: -48.8487 },
  { city: 'JOI', name: 'Joinville', state: 'SC', region: 'Sul', lat: -26.3045, lng: -48.8487 },
  { city: 'BLUMENAU', name: 'Blumenau', state: 'SC', region: 'Sul', lat: -26.9194, lng: -49.0661 },
  { city: 'CHAPECO', name: 'Chapecó', state: 'SC', region: 'Sul', lat: -27.1006, lng: -52.6156 },
  { city: 'SAO JOSE', name: 'São José', state: 'SC', region: 'Sul', lat: -27.6136, lng: -48.6367 },
  { city: 'CRICIUMA', name: 'Criciúma', state: 'SC', region: 'Sul', lat: -28.6775, lng: -49.3703 },
  { city: 'JARAGUA DO SUL', name: 'Jaraguá do Sul', state: 'SC', region: 'Sul', lat: -26.4850, lng: -49.0736 },
  { city: 'BRUSQUE', name: 'Brusque', state: 'SC', region: 'Sul', lat: -27.0981, lng: -48.9167 },
  { city: 'LAGES', name: 'Lages', state: 'SC', region: 'Sul', lat: -27.8158, lng: -50.3261 },

  // Rio Grande do Sul
  { city: 'PORTO ALEGRE', name: 'Porto Alegre', state: 'RS', region: 'Sul', lat: -30.0346, lng: -51.2177 },
  { city: 'POA', name: 'Porto Alegre', state: 'RS', region: 'Sul', lat: -30.0346, lng: -51.2177 },
  { city: 'CANOAS', name: 'Canoas', state: 'RS', region: 'Sul', lat: -29.9178, lng: -51.1836 },
  { city: 'CAXIAS DO SUL', name: 'Caxias do Sul', state: 'RS', region: 'Sul', lat: -29.1678, lng: -51.1794 },
  { city: 'CXJ', name: 'Caxias do Sul', state: 'RS', region: 'Sul', lat: -29.1678, lng: -51.1794 },
  { city: 'PELOTAS', name: 'Pelotas', state: 'RS', region: 'Sul', lat: -31.7654, lng: -52.3376 },
  { city: 'RIO GRANDE', name: 'Rio Grande', state: 'RS', region: 'Sul', lat: -32.0350, lng: -52.0986 },
  { city: 'RIG', name: 'Rio Grande', state: 'RS', region: 'Sul', lat: -32.0350, lng: -52.0986 },
  { city: 'PASSO FUNDO', name: 'Passo Fundo', state: 'RS', region: 'Sul', lat: -28.2628, lng: -52.4083 },
  { city: 'SANTA MARIA', name: 'Santa Maria', state: 'RS', region: 'Sul', lat: -29.6842, lng: -53.8069 },
  { city: 'GRAVATAI', name: 'Gravataí', state: 'RS', region: 'Sul', lat: -29.9439, lng: -50.9928 },
  { city: 'NOVO HAMBURGO', name: 'Novo Hamburgo', state: 'RS', region: 'Sul', lat: -29.6783, lng: -51.1314 },
  { city: 'SAO LEOPOLDO', name: 'São Leopoldo', state: 'RS', region: 'Sul', lat: -29.7606, lng: -51.1472 },
  { city: 'BENTO GONCALVES', name: 'Bento Gonçalves', state: 'RS', region: 'Sul', lat: -29.1711, lng: -51.5189 },
  { city: 'SANTA CRUZ DO SUL', name: 'Santa Cruz do Sul', state: 'RS', region: 'Sul', lat: -29.7186, lng: -52.4278 },
  { city: 'URUGUAIANA', name: 'Uruguaiana', state: 'RS', region: 'Sul', lat: -29.7547, lng: -57.0883 },
  { city: 'ESTEIO', name: 'Esteio', state: 'RS', region: 'Sul', lat: -29.8519, lng: -51.1822 },
  { city: 'LAJEADO', name: 'Lajeado', state: 'RS', region: 'Sul', lat: -29.4669, lng: -51.9614 },
];

// Quick index by normalized city name
const CITY_MAP = new Map<string, CityData>();
BRAZIL_CITIES.forEach(c => {
  CITY_MAP.set(c.city, c);
});

// Legacy unit code mapping to city and region
export const LEGACY_UNIT_MAP: Record<string, { city: string; state: string; region: RegionName; lat: number; lng: number }> = {
  FFOR: { city: 'Fortaleza', state: 'CE', region: 'Nordeste', lat: -3.7319, lng: -38.5267 },
  FSLZ: { city: 'São Luís', state: 'MA', region: 'Nordeste', lat: -2.5307, lng: -44.3068 },
  FTHE: { city: 'Teresina', state: 'PI', region: 'Nordeste', lat: -5.0920, lng: -42.8038 },
  FJPA: { city: 'João Pessoa', state: 'PB', region: 'Nordeste', lat: -7.1195, lng: -34.8450 },
  FSSA: { city: 'Salvador', state: 'BA', region: 'Nordeste', lat: -12.9777, lng: -38.5016 },
  FSUA: { city: 'Suape / Ipojuca', state: 'PE', region: 'Nordeste', lat: -8.3986, lng: -34.9667 },
  FMCZ: { city: 'Maceió', state: 'AL', region: 'Nordeste', lat: -9.6498, lng: -35.7089 },
  CNAT: { city: 'Natal', state: 'RN', region: 'Nordeste', lat: -5.7945, lng: -35.2110 },
  CAJU: { city: 'Aracaju', state: 'SE', region: 'Nordeste', lat: -10.9472, lng: -37.0731 },

  FBLM: { city: 'Belém', state: 'PA', region: 'Norte', lat: -1.4558, lng: -48.4902 },
  FPVH: { city: 'Porto Velho', state: 'RO', region: 'Norte', lat: -8.7619, lng: -63.9039 },
  FMAO: { city: 'Manaus', state: 'AM', region: 'Norte', lat: -3.1190, lng: -60.0217 },
  RCBC: { city: 'Barcarena', state: 'PA', region: 'Norte', lat: -1.5058, lng: -48.6698 },
  CSAN: { city: 'Santarém', state: 'PA', region: 'Norte', lat: -2.4431, lng: -54.7083 },
  CARA: { city: 'Araguaína', state: 'TO', region: 'Norte', lat: -7.1917, lng: -48.2072 },

  FVAG: { city: 'Várzea Grande / Cuiabá', state: 'MT', region: 'Centro-Oeste', lat: -15.6508, lng: -56.1325 },
  CGR: { city: 'Campo Grande', state: 'MS', region: 'Centro-Oeste', lat: -20.4697, lng: -54.6201 },
  GYN: { city: 'Goiânia', state: 'GO', region: 'Centro-Oeste', lat: -16.6869, lng: -49.2648 },
  BSB: { city: 'Brasília', state: 'DF', region: 'Centro-Oeste', lat: -15.7975, lng: -47.8919 },
  RVD: { city: 'Rio Verde', state: 'GO', region: 'Centro-Oeste', lat: -17.7925, lng: -50.9192 },
  RNO: { city: 'Rondonópolis', state: 'MT', region: 'Centro-Oeste', lat: -16.4674, lng: -54.6367 },

  SPO: { city: 'São Paulo', state: 'SP', region: 'Sudeste', lat: -23.5505, lng: -46.6333 },
  CPQ: { city: 'Campinas', state: 'SP', region: 'Sudeste', lat: -22.9099, lng: -47.0626 },
  SSZ: { city: 'Santos', state: 'SP', region: 'Sudeste', lat: -23.9608, lng: -46.3336 },
  SJC: { city: 'São José dos Campos', state: 'SP', region: 'Sudeste', lat: -23.2237, lng: -45.9009 },
  RAO: { city: 'Ribeirão Preto', state: 'SP', region: 'Sudeste', lat: -21.1767, lng: -47.8208 },
  RIO: { city: 'Rio de Janeiro', state: 'RJ', region: 'Sudeste', lat: -22.9068, lng: -43.1729 },
  DUQ: { city: 'Duque de Caxias', state: 'RJ', region: 'Sudeste', lat: -22.7856, lng: -43.3117 },
  BHZ: { city: 'Belo Horizonte', state: 'MG', region: 'Sudeste', lat: -19.9208, lng: -43.9378 },
  UBA: { city: 'Uberlândia', state: 'MG', region: 'Sudeste', lat: -18.9186, lng: -48.2772 },
  VIX: { city: 'Vitória', state: 'ES', region: 'Sudeste', lat: -20.3155, lng: -40.3128 },

  CWB: { city: 'Curitiba', state: 'PR', region: 'Sul', lat: -25.4290, lng: -49.2671 },
  PNG: { city: 'Paranaguá', state: 'PR', region: 'Sul', lat: -25.5205, lng: -48.5095 },
  LDB: { city: 'Londrina', state: 'PR', region: 'Sul', lat: -23.3045, lng: -51.1696 },
  FLN: { city: 'Florianópolis', state: 'SC', region: 'Sul', lat: -27.5954, lng: -48.5480 },
  ITA: { city: 'Itajaí', state: 'SC', region: 'Sul', lat: -26.9078, lng: -48.6619 },
  JOI: { city: 'Joinville', state: 'SC', region: 'Sul', lat: -26.3045, lng: -48.8487 },
  POA: { city: 'Porto Alegre', state: 'RS', region: 'Sul', lat: -30.0346, lng: -51.2177 },
  CXJ: { city: 'Caxias do Sul', state: 'RS', region: 'Sul', lat: -29.1678, lng: -51.1794 },
  RIG: { city: 'Rio Grande', state: 'RS', region: 'Sul', lat: -32.0350, lng: -52.0986 },
};

export interface ResolvedLocationResult {
  city: string;
  state: string;
  region: RegionName;
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Extracts a 2-letter state code from a string if present.
 * Looks for patterns like "- SP", "/ SP", "(SP)", or standalone 2-letter words matching UFs.
 */
function extractStateCode(text: string): string | null {
  if (!text) return null;
  const upper = text.toUpperCase().trim();

  // 1. Direct 2-letter check
  if (STATE_TO_REGION[upper]) return upper;

  // 2. Pattern "- CE", "/ CE", "(CE)", " - CE"
  const m = upper.match(/(?:[-–—/_(\s])([A-Z]{2})(?:[-–—/_\)\s]|$)/);
  if (m && STATE_TO_REGION[m[1]]) {
    return m[1];
  }

  // 3. End of string "FORTALEZA CE"
  const mEnd = upper.match(/\b([A-Z]{2})$/);
  if (mEnd && STATE_TO_REGION[mEnd[1]]) {
    return mEnd[1];
  }

  return null;
}

/**
 * Core function that resolves discharge location and unit into real city, state, region and coordinates:
 * As specifically requested:
 * "levar em consideração o local de descarga a coluna Unidade e verificar a verdadeira região
 * de acordo com o nome da localização da cidade informada na informação antes do traço."
 */
export function resolveLocationFromUnit(rawLocation: string): ResolvedLocationResult {
  if (!rawLocation || typeof rawLocation !== 'string') {
    return {
      city: 'Não Informado',
      state: '',
      region: 'Outras',
      lat: -14.235,
      lng: -51.9253,
      displayName: 'Não Informado',
    };
  }

  const rawTrimmed = rawLocation.trim();
  const rawUpper = rawTrimmed.toUpperCase();

  // 1. Check direct Legacy unit code first (e.g. FFOR, FVAG, SPO, etc.)
  if (LEGACY_UNIT_MAP[rawUpper]) {
    const leg = LEGACY_UNIT_MAP[rawUpper];
    return {
      city: leg.city,
      state: leg.state,
      region: leg.region,
      lat: leg.lat,
      lng: leg.lng,
      displayName: `${leg.city} (${leg.state})`,
    };
  }

  // 2. PRIMARY SPEC: Parse the part BEFORE THE DASH ("-", "–", "—")
  // Example: "FORTALEZA - CE" -> beforeDash = "FORTALEZA"
  // Example: "VÁRZEA GRANDE - MT" -> beforeDash = "VÁRZEA GRANDE"
  // Example: "JABOATÃO DOS GUARARAPES - PE" -> beforeDash = "JABOATÃO DOS GUARARAPES"
  // Example: "FORTALEZA - FFOR" -> beforeDash = "FORTALEZA"
  const parts = rawTrimmed.split(/[-–—]/);
  const beforeDash = parts[0].trim();
  const afterDash = parts.length > 1 ? parts.slice(1).join('-').trim() : '';

  const normBefore = normalizeCityName(beforeDash);
  const normAfter = normalizeCityName(afterDash);

  // Check state code in after-dash or full string
  const stateCodeFromAfter = extractStateCode(afterDash);
  const stateCodeFromFull = extractStateCode(rawTrimmed);
  const stateCode = stateCodeFromAfter || stateCodeFromFull;

  // A. Check if the text BEFORE THE DASH matches a known Brazilian city
  if (CITY_MAP.has(normBefore)) {
    const c = CITY_MAP.get(normBefore)!;
    // If state code was explicitly provided in afterDash, verify if city exists with that state, else use city's state
    const finalState = stateCode || c.state;
    const finalRegion = STATE_TO_REGION[finalState] || c.region;
    return {
      city: c.name,
      state: finalState,
      region: finalRegion,
      lat: c.lat,
      lng: c.lng,
      displayName: `${c.name} (${finalState})`,
    };
  }

  // B. Partial/Fuzzy search on city names against text BEFORE THE DASH
  // e.g. "SAO PAULO CAPITAL" -> matches "SAO PAULO"
  for (const [key, c] of CITY_MAP.entries()) {
    if (normBefore.includes(key) || key.includes(normBefore)) {
      // Avoid false positive on 2-letter or too short matches
      if (key.length >= 4 && normBefore.length >= 4) {
        const finalState = stateCode || c.state;
        const finalRegion = STATE_TO_REGION[finalState] || c.region;
        return {
          city: c.name,
          state: finalState,
          region: finalRegion,
          lat: c.lat,
          lng: c.lng,
          displayName: `${c.name} (${finalState})`,
        };
      }
    }
  }

  // C. What if beforeDash was a code and afterDash was the city? (e.g. "FFOR - FORTALEZA" or "SPO - SAO PAULO")
  if (LEGACY_UNIT_MAP[normBefore]) {
    const leg = LEGACY_UNIT_MAP[normBefore];
    return {
      city: leg.city,
      state: leg.state,
      region: leg.region,
      lat: leg.lat,
      lng: leg.lng,
      displayName: `${leg.city} (${leg.state})`,
    };
  }

  if (normAfter && CITY_MAP.has(normAfter)) {
    const c = CITY_MAP.get(normAfter)!;
    const finalState = stateCode || c.state;
    const finalRegion = STATE_TO_REGION[finalState] || c.region;
    return {
      city: c.name,
      state: finalState,
      region: finalRegion,
      lat: c.lat,
      lng: c.lng,
      displayName: `${c.name} (${finalState})`,
    };
  }

  // D. If state code was found (e.g. "CIDADE_DESCONHECIDA - CE" or "- MT")
  if (stateCode && STATE_TO_REGION[stateCode]) {
    const reg = STATE_TO_REGION[stateCode];
    const centroid = STATE_CENTROIDS[stateCode];
    const cityName = beforeDash || `Unidade ${stateCode}`;
    return {
      city: cityName,
      state: stateCode,
      region: reg,
      lat: centroid ? centroid.lat : -14.235,
      lng: centroid ? centroid.lng : -51.9253,
      displayName: `${cityName} (${stateCode})`,
    };
  }

  // E. Fallback: Check if city is mentioned anywhere in the string
  const normFull = normalizeCityName(rawTrimmed);
  for (const [key, c] of CITY_MAP.entries()) {
    if (key.length >= 4 && normFull.includes(key)) {
      return {
        city: c.name,
        state: c.state,
        region: c.region,
        lat: c.lat,
        lng: c.lng,
        displayName: `${c.name} (${c.state})`,
      };
    }
  }

  // Final fallback for completely unidentifiable text
  return {
    city: beforeDash || rawTrimmed,
    state: '',
    region: 'Outras',
    lat: -14.235,
    lng: -51.9253,
    displayName: beforeDash || rawTrimmed,
  };
}

/**
 * Helper to get UnitLocation for map pins
 */
export function getResolvedUnitLocation(unitCode: string, fallbackRegion?: RegionName): UnitLocation {
  const resolved = resolveLocationFromUnit(unitCode);
  return {
    code: unitCode,
    name: resolved.displayName || unitCode,
    lat: resolved.lat,
    lng: resolved.lng,
    region: resolved.region !== 'Outras' ? resolved.region : (fallbackRegion || 'Outras'),
    state: resolved.state,
  };
}
