import React from 'react';
import {
  Truck,
  TrendingUp,
  MapPin,
  Building2,
  Package,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { KpiSummary, RegionName } from '../types';

interface KpiCardsProps {
  kpis: KpiSummary | null;
  selectedRegion: RegionName | 'Todas';
  onSelectRegion: (regiao: RegionName | 'Todas') => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({
  kpis,
  selectedRegion,
  onSelectRegion,
}) => {
  if (!kpis) return null;

  const opportunityPercent = kpis.totalVeiculos > 0
    ? Math.round((kpis.totalOportunidades / kpis.totalVeiculos) * 100)
    : 0;

  const regionsList: { name: RegionName; label: string; color: string; border: string; bg: string; activeBg: string }[] = [
    { name: 'Nordeste', label: 'Nordeste', color: 'text-orange-700', border: 'border-orange-200', bg: 'bg-orange-50/50', activeBg: 'bg-orange-100 text-orange-800 ring-2 ring-orange-500' },
    { name: 'Norte', label: 'Norte', color: 'text-emerald-700', border: 'border-emerald-200', bg: 'bg-emerald-50/50', activeBg: 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-500' },
    { name: 'Centro-Oeste', label: 'Centro-Oeste', color: 'text-amber-700', border: 'border-amber-200', bg: 'bg-amber-50/50', activeBg: 'bg-amber-100 text-amber-800 ring-2 ring-amber-500' },
    { name: 'Sudeste', label: 'Sudeste', color: 'text-blue-700', border: 'border-blue-200', bg: 'bg-blue-50/50', activeBg: 'bg-blue-100 text-blue-800 ring-2 ring-blue-500' },
    { name: 'Sul', label: 'Sul', color: 'text-purple-700', border: 'border-purple-200', bg: 'bg-purple-50/50', activeBg: 'bg-purple-100 text-purple-800 ring-2 ring-purple-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Top Main Stat Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Veículos Ativos */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Veículos Ativos</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {kpis.totalVeiculos.toLocaleString('pt-BR')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Placas únicas deduplicadas
          </p>
        </div>

        {/* Oportunidades Operacionais */}
        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-900">Oportunidades</span>
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shadow-blue-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-700 tracking-tight">
              {kpis.totalOportunidades.toLocaleString('pt-BR')}
            </span>
            <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
              {opportunityPercent}%
            </span>
          </div>
          <p className="text-[11px] text-blue-600/80 mt-1">
            Status operacionais ativos
          </p>
        </div>

        {/* Unidades Atendidas */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Unidades / Hubs</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {kpis.totalUnidades.toLocaleString('pt-BR')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Terminais com fluxo ativo
          </p>
        </div>

        {/* Transportadoras */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Transportadoras</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {kpis.totalTransportadoras.toLocaleString('pt-BR')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Parceiros (BRADO excluído)
          </p>
        </div>

        {/* Paletes */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Volume Total Paletes</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 tracking-tight">
            {kpis.totalPaletes.toLocaleString('pt-BR')}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Cargas em movimentação
          </p>
        </div>
      </div>

      {/* Regional Selector Quick Filter Bar */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pl-1">
          <Compass className="w-4 h-4 text-blue-600" />
          <span>Filtro Rápido por Região:</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onSelectRegion('Todas')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              selectedRegion === 'Todas'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 bg-slate-50 border border-slate-200'
            }`}
          >
            Todas as Regiões ({kpis.totalVeiculos})
          </button>

          {regionsList.map((r) => {
            const count = kpis.regiaoCount[r.name] || 0;
            const isSelected = selectedRegion === r.name;
            return (
              <button
                key={r.name}
                onClick={() => onSelectRegion(r.name)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? r.activeBg
                    : `${r.bg} ${r.border} ${r.color} hover:bg-opacity-80`
                }`}
              >
                <span>{r.label}</span>
                <span className="px-1.5 py-0.2 bg-white/80 rounded-full font-bold text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
