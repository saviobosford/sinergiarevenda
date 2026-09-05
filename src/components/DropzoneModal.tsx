import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import {
  Upload,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FileDown,
  RefreshCw,
  Sparkles,
  Info,
} from 'lucide-react';
import { FileMetadata } from '../types';
import { generateSampleCsv } from '../utils/sampleData';

interface DropzoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileLoaded: (file: File) => void;
  onLoadSample: () => void;
  metadata: FileMetadata | null;
  isLoading: boolean;
}

export const DropzoneModal: React.FC<DropzoneModalProps> = ({
  isOpen,
  onClose,
  onFileLoaded,
  onLoadSample,
  metadata,
  isLoading,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setErrorMessage(null);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndProcess(files[0]);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndProcess(files[0]);
    }
    // reset input so selecting the same file triggers change if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateAndProcess = (file: File) => {
    const isCsv =
      file.name.toLowerCase().endsWith('.csv') ||
      file.type === 'text/csv' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.toLowerCase().endsWith('.txt');

    if (!isCsv) {
      setErrorMessage('Por favor, selecione um arquivo válido com extensão .csv');
      return;
    }

    onFileLoaded(file);
  };

  const handleDownloadTemplate = () => {
    const csvContent = '\uFEFF' + generateSampleCsv(10);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'modelo_importacao_logistica.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="modal-csv-upload"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Importação Dinâmica de CSV
              </h2>
              <p className="text-xs text-slate-500">
                Delimitador padrão ponto e vírgula (;) • Atualização em tempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Status feedback if file loaded */}
          {metadata && (
            <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1 text-slate-700 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-800 text-sm">
                    ✅ Arquivo carregado
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {metadata.lastUpdated}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-emerald-100">
                  <div>
                    <span className="text-slate-500 block">Nome do arquivo:</span>
                    <strong className="text-slate-900 truncate block">
                      {metadata.fileName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Quantidade de registros:</span>
                    <strong className="text-emerald-700 block">
                      {metadata.processedRows.toLocaleString('pt-BR')} ativos{' '}
                      <span className="text-xs text-slate-500 font-normal">
                        ({metadata.totalRawRows.toLocaleString('pt-BR')} brutos)
                      </span>
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Drag and Drop Zone */}
          <div
            id="drag-and-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
              isDragging
                ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/40 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInput}
              accept=".csv,text/csv,text/plain"
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
              <Upload className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-800 mb-1">
              Arraste o CSV aqui ou clique para selecionar
            </p>
            <p className="text-xs text-slate-500 max-w-sm">
              Compatível com arquivos com delimitador ponto e vírgula (;). Suporta de 5.000 a 20.000+ registros com processamento ultrarrápido local.
            </p>

            {isLoading && (
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Processando registros no navegador...
              </div>
            )}
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Automatic Treatment Rules Info Card */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-800">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Regras de Tratamento Automático Aplicadas:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 pl-4 list-disc text-slate-600">
              <li>Exclusão de Status: Finalizado, Sinistro, Cancelado</li>
              <li>Exclusão de Transportador: BRADO (ignora caixa)</li>
              <li>Filtro Temporal: base na data atual do navegador</li>
              <li>Deduplicação: mantido apenas o último status da placa</li>
              <li>Identificação: Cavalo (ou Motorista + Carreta)</li>
              <li>Regionalização: Cidade antes do traço (Local de descarga / Unidade)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handleDownloadTemplate}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span>Baixar Modelo CSV (Template)</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLoadSample();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Carregar Dados de Exemplo</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
