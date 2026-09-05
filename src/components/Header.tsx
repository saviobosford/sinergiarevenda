import React from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  FileText,
  FileDown,
  RefreshCw,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { FileMetadata, ProcessedVehicle } from '../types';
import { exportToExcel, exportToCsv, exportToPdf, exportToHtml } from '../utils/exportUtils';

interface HeaderProps {
  metadata: FileMetadata | null;
  vehicles: ProcessedVehicle[];
  onOpenUpload: () => void;
  onLoadSample: () => void;
  isLoadingSample: boolean;
  onOpenReports: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  metadata,
  vehicles,
  onOpenUpload,
  onLoadSample,
  isLoadingSample,
  onOpenReports,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Brand & App Info */}
          <div className="flex items-center gap-3">
            <div className="h-10 px-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-xs shrink-0">
              <img
                src="/solar-coca-cola-logo.svg"
                alt="Solar Coca-Cola"
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Dashboard de Acompanhamento Sinergia
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Revenda x Transferência
              </p>
            </div>
          </div>

          {/* Quick Actions & Upload Button */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Botão Exportar (HTML para compartilhamento entre analistas) */}
            <button
              id="btn-export-html"
              onClick={() => exportToHtml(vehicles, metadata)}
              disabled={vehicles.length === 0}
              title="Exportar dashboard completo em HTML autônomo para envio e visualização total pelos demais analistas"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            {/* Reports Modal Trigger */}
            <button
              id="btn-open-reports"
              onClick={onOpenReports}
              disabled={vehicles.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Relatórios</span>
            </button>

            {/* Export Dropdown / Buttons */}
            {vehicles.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  id="btn-export-excel"
                  onClick={() => exportToExcel(vehicles)}
                  title="Exportar para Excel (.xlsx)"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-emerald-800 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>XLSX</span>
                </button>
                <button
                  id="btn-export-csv"
                  onClick={() => exportToCsv(vehicles)}
                  title="Exportar para CSV (.csv)"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>CSV</span>
                </button>
                <button
                  id="btn-export-pdf"
                  onClick={() => exportToPdf(vehicles)}
                  title="Exportar para PDF (.pdf)"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-rose-800 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-rose-600" />
                  <span>PDF</span>
                </button>
                <button
                  id="btn-export-html-group"
                  onClick={() => exportToHtml(vehicles, metadata)}
                  title="Exportar Dashboard completo em HTML (.html)"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-800 hover:bg-white hover:shadow-xs rounded transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>HTML</span>
                </button>
              </div>
            )}

            {/* Prominent Requested Button: [ IMPORTAR PLANILHA CSV ] */}
            <button
              id="btn-import-csv"
              onClick={onOpenUpload}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer tracking-wider"
            >
              <Upload className="w-4 h-4" />
              <span>IMPORTAR PLANILHA CSV</span>
            </button>
          </div>
        </div>

        {/* File Metadata Bar if Loaded */}
        {metadata && (
          <div className="py-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Arquivo carregado
              </span>
              <span className="font-medium text-slate-800 truncate max-w-xs">
                {metadata.fileName}
              </span>
              <span className="text-slate-400">|</span>
              <span>
                <strong className="text-slate-900">{metadata.processedRows.toLocaleString('pt-BR')}</strong> registros ativos
              </span>
              {metadata.excludedCount > 0 && (
                <span className="text-slate-500 text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                  ({metadata.excludedCount.toLocaleString('pt-BR')} excluídos por regras: BRADO / Finalizado / Temporal)
                </span>
              )}
            </div>
            <div className="text-slate-500 text-[11px]">
              Atualizado: {metadata.lastUpdated}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
