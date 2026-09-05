import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  Truck,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileSpreadsheet,
  FileDown,
  ArrowUpDown,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { ProcessedVehicle, RegionName } from '../types';
import { exportToExcel, exportToCsv, exportToPdf } from '../utils/exportUtils';
import { REGION_CENTERS } from '../utils/constants';

interface DataTableProps {
  vehicles: ProcessedVehicle[];
  selectedUnit?: string;
  onSelectUnit?: (unidade: string) => void;
  onOpenUnitDrillDown: (unidade: string) => void;
  selectedRegion?: RegionName | 'Todas';
  onSelectRegion?: (regiao: RegionName | 'Todas') => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  vehicles,
  selectedUnit,
  onSelectUnit,
  onOpenUnitDrillDown,
  selectedRegion,
  onSelectRegion,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState<string>(selectedUnit || 'Todas');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [carrierFilter, setCarrierFilter] = useState<string>('Todas');
  const [onlyOpportunities, setOnlyOpportunities] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [sortField, setSortField] = useState<keyof ProcessedVehicle>('cavalo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Synchronize internal unitFilter if selectedUnit prop changes
  useEffect(() => {
    if (selectedUnit !== undefined) {
      setUnitFilter(selectedUnit);
    }
  }, [selectedUnit]);

  // Unique unit list for filter dropdown (Substitui filtro de Região por Unidade)
  const unitOptions = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.unidade && v.unidade !== 'N/D') set.add(v.unidade);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [vehicles]);

  // Unique status list for filter dropdown
  const statusOptions = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.status) set.add(v.status);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Unique carrier list
  const carrierOptions = useMemo(() => {
    const set = new Set<string>();
    vehicles.forEach(v => {
      if (v.transportador) set.add(v.transportador);
    });
    return Array.from(set).sort();
  }, [vehicles]);

  // Filtering
  const filteredVehicles = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return vehicles.filter(v => {
      // Unit filter (Substitui o filtro de Região por Unidade)
      if (unitFilter !== 'Todas' && v.unidade !== unitFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'Todos' && v.status !== statusFilter) {
        return false;
      }

      // Carrier filter
      if (carrierFilter !== 'Todas' && v.transportador !== carrierFilter) {
        return false;
      }

      // Only opportunities
      if (onlyOpportunities && !v.isOportunidade) {
        return false;
      }

      // Text search
      if (term) {
        const matches =
          v.cavalo.toLowerCase().includes(term) ||
          v.carretas.toLowerCase().includes(term) ||
          v.motorista.toLowerCase().includes(term) ||
          v.transportador.toLowerCase().includes(term) ||
          v.unidade.toLowerCase().includes(term) ||
          v.nf.toLowerCase().includes(term) ||
          v.fornecedor.toLowerCase().includes(term);

        if (!matches) return false;
      }

      return true;
    });
  }, [vehicles, unitFilter, statusFilter, carrierFilter, onlyOpportunities, searchTerm]);

  // Sorting
  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
      const aVal = a[sortField] ?? '';
      const bVal = b[sortField] ?? '';

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
    });
  }, [filteredVehicles, sortField, sortOrder]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(sortedVehicles.length / rowsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (validCurrentPage - 1) * rowsPerPage;
    return sortedVehicles.slice(start, start + rowsPerPage);
  }, [sortedVehicles, validCurrentPage, rowsPerPage]);

  const handleSort = (field: keyof ProcessedVehicle) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('Todos');
    setCarrierFilter('Todas');
    setUnitFilter('Todas');
    onSelectUnit?.('Todas');
    setOnlyOpportunities(false);
    onSelectRegion?.('Todas');
    setCurrentPage(1);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header & Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Tabela Operacional de Frotas e Cargas
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
                {sortedVehicles.length.toLocaleString('pt-BR')} registros filtrados
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Visualização com deduplicação de placa, ordenação rápida e exportações instantâneas
            </p>
          </div>

          {/* Export Actions for Filtered Set */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              onClick={() => exportToExcel(sortedVehicles, 'relatorio_veiculos_filtrados.xlsx')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
              title="Exportar dados filtrados para Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => exportToCsv(sortedVehicles, 'relatorio_veiculos_filtrados.csv')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors cursor-pointer"
              title="Exportar dados filtrados para CSV"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => exportToPdf(sortedVehicles, 'Relatório de Frotas Filtradas', 'relatorio_filtrado.pdf')}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
              title="Exportar dados filtrados para PDF"
            >
              <FileDown className="w-3.5 h-3.5 text-rose-600" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2 pt-1">
          {/* Search Input */}
          <div className="md:col-span-4 relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar placa, motorista, NF, unidade..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* Unit Select (Substituído filtro de Região por Unidade) */}
          <div className="md:col-span-2">
            <select
              value={unitFilter}
              onChange={e => {
                const val = e.target.value;
                setUnitFilter(val);
                onSelectUnit?.(val);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500 truncate font-medium"
              title="Filtrar por Unidade"
            >
              <option value="Todas">Todas as Unidades</option>
              {unitOptions.map(u => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500"
            >
              <option value="Todos">Todos os Status</option>
              {statusOptions.map(st => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Carrier Select */}
          <div className="md:col-span-2">
            <select
              value={carrierFilter}
              onChange={e => {
                setCarrierFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-hidden focus:border-blue-500 truncate"
            >
              <option value="Todas">Todas Transportadoras</option>
              {carrierOptions.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Opportunity Checkbox Toggle */}
          <div className="md:col-span-2 flex items-center justify-between gap-1">
            <button
              onClick={() => {
                setOnlyOpportunities(!onlyOpportunities);
                setCurrentPage(1);
              }}
              className={`w-full py-1.5 px-2 text-xs font-medium rounded-lg border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                onlyOpportunities
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Oportunidades</span>
            </button>

            {(searchTerm || statusFilter !== 'Todos' || carrierFilter !== 'Todas' || onlyOpportunities || unitFilter !== 'Todas') && (
              <button
                onClick={resetFilters}
                title="Limpar todos os filtros"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-100 text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200 select-none">
            <tr>
              <th
                onClick={() => handleSort('cavalo')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Placa / Cavalo</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('carretas')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Carretas</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('motorista')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Motorista</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('transportador')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Transportador</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('unidade')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Unidade</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('regiao')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Região</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-3 cursor-pointer hover:bg-slate-200/70 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3">Previsão na Unidade</th>
              <th className="py-3 px-3">Chegada Unidade</th>
              <th className="py-3 px-3 text-center">Paletes</th>
              <th className="py-3 px-3">NF</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-400 text-sm">
                  Nenhum veículo corresponde aos filtros selecionados.
                </td>
              </tr>
            ) : (
              paginatedData.map((v, idx) => {
                const regMeta = REGION_CENTERS[v.regiao] || REGION_CENTERS['Outras'];
                return (
                  <tr key={v.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    {/* Placa / Cavalo */}
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{v.cavalo}</span>
                      </div>
                    </td>

                    {/* Carreta */}
                    <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {v.carretas}
                    </td>

                    {/* Motorista */}
                    <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap font-medium">
                      {v.motorista}
                    </td>

                    {/* Transportador */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {v.transportador}
                    </td>

                    {/* Unidade */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <button
                        onClick={() => onOpenUnitDrillDown(v.unidade)}
                        className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
                        title="Ver detalhamento desta unidade"
                      >
                        <MapPin className="w-3 h-3 text-blue-500" />
                        <span>{v.unidade}</span>
                      </button>
                    </td>

                    {/* Região */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ backgroundColor: `${regMeta.color}15`, color: regMeta.color }}
                      >
                        {v.regiao}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          v.isOportunidade
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>

                    {/* Previsão na Unidade */}
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {v.previsaoUnidade || '-'}
                    </td>

                    {/* Chegada Unidade */}
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                      {v.chegadaUnidade || '-'}
                    </td>

                    {/* Paletes */}
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-800">
                      {v.palletes > 0 ? v.palletes : '-'}
                    </td>

                    {/* NF */}
                    <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {v.nf || '-'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Linhas por página:</span>
          <select
            value={rowsPerPage}
            onChange={e => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="py-1 px-2 rounded border border-slate-300 bg-white text-slate-700 text-xs focus:outline-hidden"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-slate-400">|</span>
          <span>
            Mostrando <strong>{sortedVehicles.length > 0 ? (validCurrentPage - 1) * rowsPerPage + 1 : 0}</strong> a{' '}
            <strong>{Math.min(validCurrentPage * rowsPerPage, sortedVehicles.length)}</strong> de{' '}
            <strong>{sortedVehicles.length.toLocaleString('pt-BR')}</strong> registros
          </span>
        </div>

        {/* Page Nav */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={validCurrentPage === 1}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Primeira página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={validCurrentPage === 1}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Página anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <span className="px-2 py-0.5 font-medium text-slate-800">
            Página {validCurrentPage} de {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={validCurrentPage === totalPages}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Próxima página"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={validCurrentPage === totalPages}
            className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
