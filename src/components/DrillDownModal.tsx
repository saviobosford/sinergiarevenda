import React, { useState, useMemo } from 'react';
import {
  X,
  MapPin,
  Building2,
  Truck,
  Download,
  Search,
  ChevronRight,
  FileSpreadsheet,
  FileDown,
} from 'lucide-react';
import { ProcessedVehicle, RegionName } from '../types';
import { exportToExcel, exportToCsv, exportToPdf } from '../utils/exportUtils';
import { REGION_CENTERS } from '../utils/constants';

// --- Region Drill Down Modal ---
interface RegionModalProps {
  region: RegionName | null;
  vehicles: ProcessedVehicle[];
  onClose: () => void;
  onSelectUnit: (unidade: string) => void;
}

export const RegionDrillDownModal: React.FC<RegionModalProps> = ({
  region,
  vehicles,
  onClose,
  onSelectUnit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const regionVehicles = useMemo(() => {
    if (!region) return [];
    return vehicles.filter(v => v.regiao === region);
  }, [region, vehicles]);

  // Aggregate by Unit and Carrier as requested:
  // "Nome da unidade, Transportadora, Quantidade de veículos, Placas"
  const aggregatedData = useMemo(() => {
    const map = new Map<string, {
      unidade: string;
      transportador: string;
      count: number;
      placas: string[];
      vehicles: ProcessedVehicle[];
    }>();

    regionVehicles.forEach(v => {
      const key = `${v.unidade}_${v.transportador}`;
      if (!map.has(key)) {
        map.set(key, {
          unidade: v.unidade,
          transportador: v.transportador,
          count: 0,
          placas: [],
          vehicles: [],
        });
      }
      const item = map.get(key)!;
      item.count++;
      item.placas.push(v.cavalo);
      item.vehicles.push(v);
    });

    return Array.from(map.values()).sort((a, b) => {
      if (a.unidade !== b.unidade) return a.unidade.localeCompare(b.unidade);
      return b.count - a.count;
    });
  }, [regionVehicles]);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return aggregatedData;
    const q = searchTerm.toLowerCase();
    return aggregatedData.filter(item =>
      item.unidade.toLowerCase().includes(q) ||
      item.transportador.toLowerCase().includes(q) ||
      item.placas.some(p => p.toLowerCase().includes(q))
    );
  }, [aggregatedData, searchTerm]);

  if (!region) return null;
  const regMeta = REGION_CENTERS[region] || REGION_CENTERS['Outras'];

  return (
    <div
      id="modal-drill-down-regiao"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
              style={{ backgroundColor: regMeta.color }}
            >
              {region.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Drill-Down: Região {region}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {regionVehicles.length} veículos totais
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Agrupamento por Unidade, Transportadora e Placas vinculadas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToExcel(regionVehicles, `regiao_${region}_detalhado.xlsx`)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>XLSX</span>
            </button>
            <button
              onClick={() => exportToPdf(regionVehicles, `Relatório Região ${region}`, `regiao_${region}.pdf`)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por unidade, transportadora ou placa..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredData.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Nenhum registro encontrado para os critérios de busca.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Nome da Unidade</th>
                    <th className="py-2.5 px-4">Transportadora</th>
                    <th className="py-2.5 px-4 text-center">Quantidade de Veículos</th>
                    <th className="py-2.5 px-4">Placas Vinculadas</th>
                    <th className="py-2.5 px-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span>{item.unidade}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.transportador}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                          {item.count}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-md">
                          {item.placas.map((placa, pIdx) => (
                            <span
                              key={pIdx}
                              className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 text-slate-800 border border-slate-200 rounded"
                            >
                              {placa}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectUnit(item.unidade);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 cursor-pointer p-1 rounded hover:bg-blue-100"
                          title="Abrir detalhe da unidade"
                        >
                          <span>Ver</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Unit Drill Down Modal ---
interface UnitModalProps {
  unitCode: string | null;
  vehicles: ProcessedVehicle[];
  onClose: () => void;
}

export const UnitDrillDownModal: React.FC<UnitModalProps> = ({
  unitCode,
  vehicles,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const unitVehicles = useMemo(() => {
    if (!unitCode) return [];
    return vehicles.filter(v => v.unidade === unitCode);
  }, [unitCode, vehicles]);

  const filteredVehicles = useMemo(() => {
    if (!searchTerm.trim()) return unitVehicles;
    const q = searchTerm.toLowerCase();
    return unitVehicles.filter(v =>
      v.cavalo.toLowerCase().includes(q) ||
      v.motorista.toLowerCase().includes(q) ||
      v.transportador.toLowerCase().includes(q) ||
      v.status.toLowerCase().includes(q)
    );
  }, [unitVehicles, searchTerm]);

  if (!unitCode) return null;

  return (
    <div
      id="modal-drill-down-unidade"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Tabela Detalhada: Unidade {unitCode}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {unitVehicles.length} {unitVehicles.length === 1 ? 'veículo' : 'veículos'}
                </span>
                {unitVehicles[0]?.regiao && (
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    Região: {unitVehicles[0].regiao}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Placa, Motorista, Transportadora, Status, Previsão, Chegada e Saída
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToExcel(unitVehicles, `unidade_${unitCode}.xlsx`)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>XLSX</span>
            </button>
            <button
              onClick={() => exportToPdf(unitVehicles, `Detalhamento da Unidade ${unitCode}`, `unidade_${unitCode}.pdf`)}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="px-6 py-3 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por placa, motorista, transportadora ou status..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Detailed Table */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredVehicles.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Nenhum veículo encontrado para esta unidade.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/75 text-[11px] font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Placa</th>
                    <th className="py-2.5 px-3">Motorista</th>
                    <th className="py-2.5 px-3">Transportadora</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Previsão na Unidade</th>
                    <th className="py-2.5 px-3">Chegada Unidade</th>
                    <th className="py-2.5 px-3">Saída Unidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVehicles.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{v.cavalo}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                        {v.motorista}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700 whitespace-nowrap">
                        {v.transportador}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          v.isOportunidade
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {v.previsaoUnidade || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {v.chegadaUnidade || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                        {v.saidaUnidade || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
