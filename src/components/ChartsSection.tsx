import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp, Layers } from 'lucide-react';
import { ProcessedVehicle, RegionName } from '../types';
import { REGION_CENTERS, OPPORTUNITY_STATUSES } from '../utils/constants';

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartsSectionProps {
  vehicles: ProcessedVehicle[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ vehicles }) => {
  // 1. Status breakdown
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      const st = v.status || 'Outro';
      counts[st] = (counts[st] || 0) + 1;
    });

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    const bgColors = labels.map(label => {
      const isOpp = OPPORTUNITY_STATUSES.has(label.toLowerCase());
      if (isOpp) {
        if (label.toLowerCase().includes('trânsito')) return '#2563eb'; // blue
        if (label.toLowerCase().includes('descarga')) return '#059669'; // emerald
        if (label.toLowerCase().includes('carregamento')) return '#f59e0b'; // amber
        if (label.toLowerCase().includes('agenda')) return '#8b5cf6'; // purple
        return '#0284c7'; // sky
      }
      return '#94a3b8'; // slate
    });

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: bgColors,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  }, [vehicles]);

  // 2. Region Distribution
  const regionData = useMemo(() => {
    const regions: RegionName[] = ['Nordeste', 'Norte', 'Centro-Oeste', 'Sudeste', 'Sul'];
    const counts: Record<RegionName, number> = {
      Nordeste: 0,
      Norte: 0,
      'Centro-Oeste': 0,
      Sudeste: 0,
      Sul: 0,
      Outras: 0,
    };

    vehicles.forEach(v => {
      counts[v.regiao] = (counts[v.regiao] || 0) + 1;
    });

    return {
      labels: regions,
      datasets: [
        {
          label: 'Veículos por Região',
          data: regions.map(r => counts[r]),
          backgroundColor: regions.map(r => REGION_CENTERS[r].color),
          borderRadius: 6,
        },
      ],
    };
  }, [vehicles]);

  // 3. Top Transportadoras
  const carrierData = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      const c = v.transportador || 'Não Informado';
      counts[c] = (counts[c] || 0) + 1;
    });

    const sorted = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7);

    return {
      labels: sorted.map(([name]) => name.length > 18 ? name.slice(0, 16) + '...' : name),
      datasets: [
        {
          label: 'Quantidade de Veículos',
          data: sorted.map(([, count]) => count),
          backgroundColor: '#3b82f6',
          borderRadius: 6,
        },
      ],
    };
  }, [vehicles]);

  // 4. Opportunities Breakdown (Specific operational cycle)
  const opportunitiesBreakdown = useMemo(() => {
    const oppMap: Record<string, number> = {
      'Programado': 0,
      'Aguarda carregamento': 0,
      'Em trânsito': 0,
      'Aguarda agenda': 0,
      'Aguarda descarga': 0,
    };

    vehicles.forEach(v => {
      const sLower = v.status.toLowerCase();
      if (sLower.includes('programado')) oppMap['Programado']++;
      else if (sLower.includes('carregamento')) oppMap['Aguarda carregamento']++;
      else if (sLower.includes('trânsito') || sLower.includes('transito')) oppMap['Em trânsito']++;
      else if (sLower.includes('agenda')) oppMap['Aguarda agenda']++;
      else if (sLower.includes('descarga')) oppMap['Aguarda descarga']++;
    });

    return {
      labels: Object.keys(oppMap),
      datasets: [
        {
          label: 'Oportunidades Ativas',
          data: Object.values(oppMap),
          backgroundColor: ['#6366f1', '#f59e0b', '#2563eb', '#8b5cf6', '#10b981'],
          borderRadius: 6,
        },
      ],
    };
  }, [vehicles]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 8,
        titleFont: { size: 12, weight: 'bold' as const },
        bodyFont: { size: 11 },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, font: { size: 10 } },
        grid: { color: '#f1f5f9' },
      },
    },
  };

  const horizontalBarOptions = {
    ...barOptions,
    indexAxis: 'y' as const,
    scales: {
      x: {
        beginAtZero: true,
        ticks: { precision: 0, font: { size: 10 } },
        grid: { color: '#f1f5f9' },
      },
      y: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: { boxWidth: 12, font: { size: 10 }, padding: 8 },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 8,
      },
    },
    cutout: '65%',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Painel Analítico de Gráficos Operacionais
          </h3>
        </div>
        <span className="text-xs text-slate-500">
          Atualização dinâmica por arquivo importado
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chart 1: Status Distribution */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-800">
              Distribuição por Status
            </span>
            <PieChart className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="h-52 relative flex items-center justify-center">
            <Doughnut data={statusData} options={doughnutOptions} />
          </div>
        </div>

        {/* Chart 2: Opportunities Breakdown */}
        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-col bg-gradient-to-b from-white to-blue-50/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-blue-950">
              Oportunidades por Etapa
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="h-52">
            <Bar data={opportunitiesBreakdown} options={barOptions} />
          </div>
        </div>

        {/* Chart 3: Regional Distribution */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-800">
              Veículos por Região
            </span>
            <Layers className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="h-52">
            <Bar data={regionData} options={barOptions} />
          </div>
        </div>

        {/* Chart 4: Top Transportadoras */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-800">
              Top Transportadoras
            </span>
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="h-52">
            <Bar data={carrierData} options={horizontalBarOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
