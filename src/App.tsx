import React, { useState, useEffect, useCallback } from 'react';
import {
  Header,
} from './components/Header';
import {
  DropzoneModal,
} from './components/DropzoneModal';
import {
  KpiCards,
} from './components/KpiCards';
import {
  LogisticsMap,
} from './components/LogisticsMap';
import {
  ChartsSection,
} from './components/ChartsSection';
import {
  DataTable,
} from './components/DataTable';
import {
  RegionDrillDownModal,
  UnitDrillDownModal,
} from './components/DrillDownModal';
import {
  ReportsModal,
} from './components/ReportsModal';
import {
  ProcessedVehicle,
  FileMetadata,
  KpiSummary,
  RegionName,
} from './types';
import { processCsvContent } from './utils/csvProcessor';
import { generateSampleCsv } from './utils/sampleData';

export default function App() {
  const [vehicles, setVehicles] = useState<ProcessedVehicle[]>([]);
  const [metadata, setMetadata] = useState<FileMetadata | null>(null);
  const [kpis, setKpis] = useState<KpiSummary | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<RegionName | 'Todas'>('Todas');
  const [selectedUnit, setSelectedUnit] = useState<string>('Todas');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [drillDownRegion, setDrillDownRegion] = useState<RegionName | null>(null);
  const [drillDownUnit, setDrillDownUnit] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  // Load sample data function
  const handleLoadSample = useCallback((count: number = 200) => {
    setIsLoadingSample(true);
    setTimeout(() => {
      try {
        const sampleCsv = generateSampleCsv(count);
        const result = processCsvContent(sampleCsv, 'amostra_logistica_operacional.csv', sampleCsv.length);
        setVehicles(result.vehicles);
        setMetadata(result.metadata);
        setKpis(result.kpis);
      } catch (err) {
        console.error('Erro ao gerar dados de exemplo:', err);
      } finally {
        setIsLoadingSample(false);
      }
    }, 150);
  }, []);

  // Initial load: start with sample data pre-rendered so dashboard is active immediately
  useEffect(() => {
    handleLoadSample(180);
  }, [handleLoadSample]);

  // File processing with encoding detection (UTF-8 with ISO-8859-1 fallback)
  const handleFileLoaded = (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      let text = (e.target?.result as string) || '';

      // Check if encoding has replacement characters, retry as Latin1
      if (text.includes('')) {
        const fallbackReader = new FileReader();
        fallbackReader.onload = (e2) => {
          const fallbackText = (e2.target?.result as string) || '';
          applyCsvData(fallbackText, file.name, file.size);
        };
        fallbackReader.readAsText(file, 'ISO-8859-1');
        return;
      }

      applyCsvData(text, file.name, file.size);
    };

    reader.onerror = () => {
      setIsLoading(false);
      alert('Ocorreu um erro ao tentar ler o arquivo selecionado.');
    };

    reader.readAsText(file, 'UTF-8');
  };

  const applyCsvData = (text: string, fileName: string, fileSize: number) => {
    try {
      const result = processCsvContent(text, fileName, fileSize);
      setVehicles(result.vehicles);
      setMetadata(result.metadata);
      setKpis(result.kpis);
      setIsUploadOpen(false);
    } catch (err) {
      console.error('Falha ao processar arquivo CSV:', err);
      alert('Falha ao processar arquivo CSV. Verifique a estrutura e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <Header
        metadata={metadata}
        vehicles={vehicles}
        onOpenUpload={() => setIsUploadOpen(true)}
        onLoadSample={() => handleLoadSample(250)}
        isLoadingSample={isLoadingSample}
        onOpenReports={() => setIsReportsOpen(true)}
      />

      {/* Main Dashboard Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPI Metrics & Regional Quick Filter */}
        <KpiCards
          kpis={kpis}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
        />

        {/* Operational Map with Recalculations & Drill-Downs */}
        <LogisticsMap
          vehicles={vehicles}
          selectedRegion={selectedRegion}
          onSelectRegion={setSelectedRegion}
          onOpenRegionDrillDown={(region) => setDrillDownRegion(region)}
          onOpenUnitDrillDown={(unit) => setDrillDownUnit(unit)}
        />

        {/* Analytic Charts Section (Status, Oportunidades, Regiões, Transportadoras) */}
        <ChartsSection vehicles={vehicles} />

        {/* Operational Data Table with Search, Filter & Quick Exports */}
        <DataTable
          vehicles={vehicles}
          selectedUnit={selectedUnit}
          onSelectUnit={setSelectedUnit}
          onOpenUnitDrillDown={(unit) => setDrillDownUnit(unit)}
        />
      </main>

      {/* Upload CSV Dropzone Modal */}
      <DropzoneModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onFileLoaded={handleFileLoaded}
        onLoadSample={() => handleLoadSample(200)}
        metadata={metadata}
        isLoading={isLoading}
      />

      {/* Region Drill-Down Modal */}
      <RegionDrillDownModal
        region={drillDownRegion}
        vehicles={vehicles}
        onClose={() => setDrillDownRegion(null)}
        onSelectUnit={(unit) => setDrillDownUnit(unit)}
      />

      {/* Unit Drill-Down Modal */}
      <UnitDrillDownModal
        unitCode={drillDownUnit}
        vehicles={vehicles}
        onClose={() => setDrillDownUnit(null)}
      />

      {/* Reports Modal */}
      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        vehicles={vehicles}
      />

      {/* Subtle Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Painel Logístico Inteligente • Processamento Local Seguro no Navegador
          </span>
          <span className="text-slate-400">
            Regras de Exclusão: Status Finalizado/Sinistro/Cancelado | BRADO excluído | Deduplicação ativa
          </span>
        </div>
      </footer>
    </div>
  );
}
