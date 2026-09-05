import React, { useState, useMemo } from 'react';
import {
  X,
  FileText,
  FileSpreadsheet,
  Download,
  FileDown,
  Building2,
  MapPin,
  TrendingUp,
  Layers,
  Printer,
} from 'lucide-react';
import { ProcessedVehicle, RegionName } from '../types';
import { exportToExcel, exportToCsv, exportToPdf } from '../utils/exportUtils';
import { REGION_CENTERS } from '../utils/constants';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ProcessedVehicle[];
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  vehicles,
}) => {
  const [activeTab, setActiveTab] = useState<'geral' | 'regioes' | 'transportadoras' | 'status'>('geral');

  // Summary by region
  const regionReport = useMemo(() => {
    const map: Record<RegionName, { veiculos: number; oportunidades: number; unidades: Set<string>; paletes: number }> = {
      Nordeste: { veiculos: 0, oportunidades: 0, unidades: new Set(), paletes: 0 },
      Norte: { veiculos: 0, oportunidades: 0, unidades: new Set(), paletes: 0 },
      'Centro-Oeste': { veiculos: 0, oportunidades: 0, unidades: new Set(), paletes: 0 },
      Sudeste: { veiculos: 0, oportunidades: 0, unidades: new Set(), paletes: 0 },
      Sul: { veiculos: 0, oportunidades: 0, unidades: new Set(), paletes: 0 },
      Outras: { veiculos: 0, oportunidades: 0, unidades: new Set(), paletes: 0 },
    };

    vehicles.forEach(v => {
      const reg = v.regiao || 'Outras';
      if (!map[reg]) {
        map[reg] = { veiculos: 0, oportunidades: 0, unidades: new Set(), paletes: 0 };
      }
      map[reg].veiculos++;
      if (v.isOportunidade) map[reg].oportunidades++;
      if (v.unidade) map[reg].unidades.add(v.unidade);
      map[reg].paletes += v.palletes;
    });

    return map;
  }, [vehicles]);

  // Summary by carrier
  const carrierReport = useMemo(() => {
    const map = new Map<string, { veiculos: number; oportunidades: number; unidades: Set<string>; paletes: number }>();

    vehicles.forEach(v => {
      const c = v.transportador || 'Não informado';
      if (!map.has(c)) {
        map.set(c, { veiculos: 0, oportunidades: 0, unidades: new Set(), paletes: 0 });
      }
      const item = map.get(c)!;
      item.veiculos++;
      if (v.isOportunidade) item.oportunidades++;
      if (v.unidade) item.unidades.add(v.unidade);
      item.paletes += v.palletes;
    });

    return Array.from(map.entries())
      .map(([carrier, data]) => ({ carrier, ...data }))
      .sort((a, b) => b.veiculos - a.veiculos);
  }, [vehicles]);

  // Summary by status
  const statusReport = useMemo(() => {
    const map = new Map<string, { count: number; paletes: number; isOpp: boolean }>();

    vehicles.forEach(v => {
      const s = v.status || 'Outro';
      if (!map.has(s)) {
        map.set(s, { count: 0, paletes: 0, isOpp: v.isOportunidade });
      }
      const item = map.get(s)!;
      item.count++;
      item.paletes += v.palletes;
    });

    return Array.from(map.entries())
      .map(([status, data]) => ({ status, ...data }))
      .sort((a, b) => b.count - a.count);
  }, [vehicles]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-relatorios"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Relatórios Gerenciais Logísticos
              </h2>
              <p className="text-xs text-slate-500">
                Consolidação operacional e exportação multi-formato (Excel, CSV, PDF)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToExcel(vehicles, 'relatorio_gerencial_completo.xlsx')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Exportar Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => exportToCsv(vehicles, 'relatorio_gerencial_completo.csv')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-blue-600" />
              <span>Exportar CSV</span>
            </button>
            <button
              onClick={() => exportToPdf(vehicles, 'Relatório Gerencial Logístico', 'relatorio_gerencial.pdf')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
            >
              <FileDown className="w-4 h-4 text-rose-600" />
              <span>Exportar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('geral')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'geral'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('regioes')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'regioes'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Por Região
          </button>
          <button
            onClick={() => setActiveTab('transportadoras')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'transportadoras'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Por Transportadora
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 px-4 border-b-2 cursor-pointer transition-colors ${
              activeTab === 'status'
                ? 'border-blue-600 text-blue-700 bg-white rounded-t'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            Por Status
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === 'geral' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Base Ativa Deduplicada</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {vehicles.length.toLocaleString('pt-BR')} veículos
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Filtrados por status e regras operacionais
                  </p>
                </div>
                <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200">
                  <span className="text-xs text-blue-800 font-semibold">Oportunidades em Aberto</span>
                  <div className="text-2xl font-bold text-blue-700 mt-1">
                    {vehicles.filter(v => v.isOportunidade).length.toLocaleString('pt-BR')}
                  </div>
                  <p className="text-[11px] text-blue-600 mt-0.5">
                    Programado, Trânsito, Carga e Descarga
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500">Volume Total em Movimento</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {vehicles.reduce((acc, v) => acc + v.palletes, 0).toLocaleString('pt-BR')}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Paletes declarados nas notas fiscais
                  </p>
                </div>
              </div>

              {/* Regional Summary Table */}
              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Distribuição Regional Sintética
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Região</th>
                        <th className="p-3 text-center">Veículos Ativos</th>
                        <th className="p-3 text-center">Oportunidades</th>
                        <th className="p-3 text-center">Unidades</th>
                        <th className="p-3 text-right">Paletes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(['Nordeste', 'Norte', 'Centro-Oeste', 'Sudeste', 'Sul'] as RegionName[]).map(r => {
                        const row = regionReport[r];
                        const meta = REGION_CENTERS[r];
                        return (
                          <tr key={r} className="hover:bg-slate-50">
                            <td className="p-3 font-semibold text-slate-900 flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
                              <span>{r}</span>
                            </td>
                            <td className="p-3 text-center font-bold text-slate-800">{row.veiculos}</td>
                            <td className="p-3 text-center font-semibold text-blue-700">{row.oportunidades}</td>
                            <td className="p-3 text-center text-slate-600">{row.unidades.size}</td>
                            <td className="p-3 text-right text-slate-700">{row.paletes.toLocaleString('pt-BR')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: POR REGIÃO */}
          {activeTab === 'regioes' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Região</th>
                    <th className="p-3 text-center">Total Veículos</th>
                    <th className="p-3 text-center">Oportunidades (%)</th>
                    <th className="p-3 text-center">Unidades Atendidas</th>
                    <th className="p-3 text-right">Paletes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(['Nordeste', 'Norte', 'Centro-Oeste', 'Sudeste', 'Sul'] as RegionName[]).map(r => {
                    const item = regionReport[r];
                    const percent = item.veiculos > 0 ? Math.round((item.oportunidades / item.veiculos) * 100) : 0;
                    return (
                      <tr key={r} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{r}</td>
                        <td className="p-3 text-center font-bold text-slate-800">{item.veiculos}</td>
                        <td className="p-3 text-center font-semibold text-blue-700">
                          {item.oportunidades} ({percent}%)
                        </td>
                        <td className="p-3 text-center text-slate-600">{item.unidades.size}</td>
                        <td className="p-3 text-right font-medium text-slate-800">
                          {item.paletes.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: POR TRANSPORTADORA */}
          {activeTab === 'transportadoras' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Transportadora</th>
                    <th className="p-3 text-center">Total Veículos</th>
                    <th className="p-3 text-center">Oportunidades</th>
                    <th className="p-3 text-center">Unidades</th>
                    <th className="p-3 text-right">Volume Paletes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {carrierReport.map(c => (
                    <tr key={c.carrier} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{c.carrier}</span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-800">{c.veiculos}</td>
                      <td className="p-3 text-center font-semibold text-blue-700">{c.oportunidades}</td>
                      <td className="p-3 text-center text-slate-600">{c.unidades.size}</td>
                      <td className="p-3 text-right text-slate-800">{c.paletes.toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 4: POR STATUS */}
          {activeTab === 'status' && (
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Status Operacional</th>
                    <th className="p-3 text-center">Tipo</th>
                    <th className="p-3 text-center">Quantidade</th>
                    <th className="p-3 text-center">% do Total</th>
                    <th className="p-3 text-right">Volume Paletes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {statusReport.map(s => {
                    const percent = vehicles.length > 0 ? Math.round((s.count / vehicles.length) * 100) : 0;
                    return (
                      <tr key={s.status} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{s.status}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.isOpp
                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {s.isOpp ? 'Oportunidade' : 'Operacional Regular'}
                          </span>
                        </td>
                        <td className="p-3 text-center font-bold text-slate-800">{s.count}</td>
                        <td className="p-3 text-center text-slate-600">{percent}%</td>
                        <td className="p-3 text-right text-slate-800">{s.paletes.toLocaleString('pt-BR')}</td>
                      </tr>
                    );
                  })}
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
            Fechar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};
