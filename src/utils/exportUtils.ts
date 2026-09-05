import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProcessedVehicle } from '../types';

export function exportToExcel(vehicles: ProcessedVehicle[], fileName = 'relatorio_logistica.xlsx') {
  const data = vehicles.map(v => ({
    'Identificador': v.id,
    'Placa Cavalo': v.cavalo,
    'Carretas': v.carretas,
    'Motorista': v.motorista,
    'Transportador': v.transportador,
    'Status': v.status,
    'Unidade': v.unidade,
    'Região': v.regiao,
    'Oportunidade': v.isOportunidade ? 'Sim' : 'Não',
    'NF': v.nf,
    'Palletes': v.palletes,
    'Fornecedor': v.fornecedor,
    'Carga Programada': v.cargaProgramada,
    'Previsão Unidade': v.previsaoUnidade,
    'Chegada Unidade': v.chegadaUnidade,
    'Saída Unidade': v.saidaUnidade,
    'Observação': v.observacao,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Monitoramento');

  // Set column widths
  const colWidths = [
    { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 22 },
    { wch: 18 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 12 },
    { wch: 10 }, { wch: 20 }, { wch: 18 }, { wch: 18 }, { wch: 18 },
    { wch: 18 }, { wch: 30 },
  ];
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, fileName);
}

export function exportToCsv(vehicles: ProcessedVehicle[], fileName = 'relatorio_logistica.csv') {
  const headers = [
    'Cavalo',
    'Carretas',
    'Motorista',
    'Transportador',
    'Status',
    'Unidade',
    'Regiao',
    'Oportunidade',
    'NF',
    'Palletes',
    'Fornecedor',
    'Carga programada',
    'Previsao na unidade',
    'Chegada Unidade',
    'Saida Unidade',
    'Observacao',
  ];

  const rows = vehicles.map(v => [
    `"${v.cavalo}"`,
    `"${v.carretas}"`,
    `"${v.motorista}"`,
    `"${v.transportador}"`,
    `"${v.status}"`,
    `"${v.unidade}"`,
    `"${v.regiao}"`,
    `"${v.isOportunidade ? 'Sim' : 'Não'}"`,
    `"${v.nf}"`,
    v.palletes,
    `"${v.fornecedor}"`,
    `"${v.cargaProgramada}"`,
    `"${v.previsaoUnidade}"`,
    `"${v.chegadaUnidade}"`,
    `"${v.saidaUnidade}"`,
    `"${v.observacao}"`,
  ].join(';'));

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToPdf(vehicles: ProcessedVehicle[], title = 'Relatório de Monitoramento Logístico', fileName = 'relatorio_logistica.pdf') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR');

  // Title header
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59);
  doc.text(title, 14, 15);

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Gerado em: ${dateStr} | Total de Veículos: ${vehicles.length}`, 14, 21);

  const tableData = vehicles.slice(0, 500).map(v => [
    v.cavalo,
    v.motorista,
    v.transportador,
    v.unidade,
    v.regiao,
    v.status,
    v.isOportunidade ? 'SIM' : 'NÃO',
    v.previsaoUnidade || '-',
    v.chegadaUnidade || '-',
  ]);

  autoTable(doc, {
    startY: 25,
    head: [['Placa', 'Motorista', 'Transportador', 'Unid.', 'Região', 'Status', 'Oportunidade', 'Previsão', 'Chegada']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [30, 58, 138], // Dark blue
      textColor: 255,
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
      overflow: 'linebreak',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  if (vehicles.length > 500) {
    const finalY = (doc as any).lastAutoTable?.finalY || 180;
    doc.setFontSize(8);
    doc.setTextColor(220, 38, 38);
    doc.text(`* Nota: Para melhor legibilidade no PDF, foram exportados os primeiros 500 registros. Use exportação Excel ou CSV para a base integral de ${vehicles.length} veículos.`, 14, finalY + 8);
  }

  doc.save(fileName);
}

export async function exportToHtml(vehicles: ProcessedVehicle[], metadata?: any, fileName = 'dashboard_sinergia_solar.html') {
  let logoSvg = '';
  try {
    const res = await fetch('/solar-coca-cola-logo.svg');
    if (res.ok) {
      logoSvg = await res.text();
    }
  } catch (e) {
    console.warn('Could not fetch logo SVG for export:', e);
  }

  if (!logoSvg) {
    logoSvg = `<svg width="180" height="50" viewBox="0 0 500 149" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="20" y="90" font-family="sans-serif" font-size="64" font-weight="900" fill="#da291c">Solar</text>
      <text x="210" y="90" font-family="sans-serif" font-size="52" font-style="italic" font-weight="bold" fill="#da291c">Coca-Cola</text>
    </svg>`;
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Pre-calculate initial summaries
  const totalVehicles = vehicles.length;
  const oportunidades = vehicles.filter(v => v.isOportunidade).length;
  const encostados = vehicles.filter(v => /encostad/i.test(v.status)).length;
  const emTransito = vehicles.filter(v => /tr[aâ]nsit/i.test(v.status)).length;
  const aguardandoDescarga = vehicles.filter(v => /aguardando descarga/i.test(v.status)).length;
  const totalPaletes = vehicles.reduce((acc, v) => acc + (Number(v.palletes) || 0), 0);

  // Status distribution
  const statusCounts: Record<string, number> = {};
  vehicles.forEach(v => {
    const s = v.status || 'Não Informado';
    statusCounts[s] = (statusCounts[s] || 0) + 1;
  });

  // Unit distribution
  const unitCounts: Record<string, number> = {};
  vehicles.forEach(v => {
    const u = v.unidade || 'Não Informada';
    unitCounts[u] = (unitCounts[u] || 0) + 1;
  });

  const vehiclesJson = JSON.stringify(vehicles).replace(/</g, '\\u003c');

  const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard de Acompanhamento Sinergia - Solar Coca-Cola</title>
  <style>
    :root {
      --solar-red: #da291c;
      --solar-red-dark: #b91c1c;
      --solar-red-light: #fef2f2;
      --slate-900: #0f172a;
      --slate-800: #1e293b;
      --slate-700: #334155;
      --slate-600: #475569;
      --slate-500: #64748b;
      --slate-400: #94a3b8;
      --slate-200: #e2e8f0;
      --slate-100: #f1f5f9;
      --slate-50: #f8fafc;
      --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-family);
      background-color: #f4f6f9;
      color: var(--slate-800);
      line-height: 1.5;
      padding: 0;
    }
    .top-header {
      background: #ffffff;
      border-bottom: 2px solid var(--solar-red);
      padding: 16px 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .brand-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .logo-container {
      height: 42px;
      display: flex;
      align-items: center;
    }
    .logo-container svg {
      height: 38px;
      width: auto;
      max-width: 160px;
    }
    .title-block h1 {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--slate-900);
      letter-spacing: -0.02em;
    }
    .title-block p {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--solar-red);
    }
    .actions-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 8px;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s ease;
      text-decoration: none;
    }
    .btn-red {
      background: var(--solar-red);
      color: #fff;
    }
    .btn-red:hover {
      background: var(--solar-red-dark);
    }
    .btn-outline {
      background: #fff;
      border-color: var(--slate-200);
      color: var(--slate-700);
    }
    .btn-outline:hover {
      background: var(--slate-100);
    }
    .badge-export-time {
      font-size: 0.75rem;
      color: var(--slate-500);
      background: var(--slate-100);
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--slate-200);
    }
    .main-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }
    /* KPI Cards */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 14px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: #fff;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.03);
      position: relative;
      overflow: hidden;
    }
    .kpi-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--slate-300);
    }
    .kpi-card.highlight::before { background: var(--solar-red); }
    .kpi-card.blue::before { background: #2563eb; }
    .kpi-card.green::before { background: #16a34a; }
    .kpi-card.amber::before { background: #d97706; }
    .kpi-card.purple::before { background: #7c3aed; }
    .kpi-title {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--slate-500);
      margin-bottom: 6px;
    }
    .kpi-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--slate-900);
      line-height: 1.2;
    }
    .kpi-sub {
      font-size: 0.72rem;
      color: var(--slate-400);
      margin-top: 4px;
    }

    /* Distribution Section */
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .insight-card {
      background: #fff;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 16px 20px;
    }
    .insight-header {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--slate-800);
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--slate-100);
      padding-bottom: 8px;
    }
    .bar-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 0.75rem;
    }
    .bar-label {
      width: 140px;
      font-weight: 600;
      color: var(--slate-700);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bar-container {
      flex: 1;
      height: 10px;
      background: var(--slate-100);
      border-radius: 5px;
      overflow: hidden;
      margin: 0 10px;
    }
    .bar-fill {
      height: 100%;
      background: var(--solar-red);
      border-radius: 5px;
      transition: width 0.3s ease;
    }
    .bar-fill.blue { background: #2563eb; }
    .bar-fill.green { background: #16a34a; }
    .bar-fill.amber { background: #d97706; }
    .bar-count {
      width: 38px;
      text-align: right;
      font-weight: 700;
      color: var(--slate-800);
    }

    /* Filter Toolbar */
    .filter-panel {
      background: #fff;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 12px;
    }
    .search-box {
      flex: 1;
      min-width: 240px;
      position: relative;
    }
    .search-box input {
      width: 100%;
      padding: 9px 12px 9px 34px;
      font-size: 0.85rem;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-box input:focus {
      border-color: var(--solar-red);
      box-shadow: 0 0 0 2px rgba(218, 41, 28, 0.1);
    }
    .search-icon {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--slate-400);
      font-size: 0.9rem;
    }
    .filter-select {
      padding: 9px 12px;
      font-size: 0.85rem;
      border: 1px solid var(--slate-200);
      border-radius: 8px;
      background: #fff;
      color: var(--slate-700);
      outline: none;
      cursor: pointer;
    }
    .filter-select:focus {
      border-color: var(--solar-red);
    }
    .filter-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--slate-700);
      cursor: pointer;
      user-select: none;
      background: var(--slate-50);
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid var(--slate-200);
    }
    .filter-toggle input {
      accent-color: var(--solar-red);
      cursor: pointer;
    }
    .filter-info {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--slate-500);
      margin-left: auto;
    }

    /* Table */
    .table-container {
      background: #fff;
      border: 1px solid var(--slate-200);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .table-scroll {
      overflow-x: auto;
      max-height: 700px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.78rem;
      text-align: left;
    }
    thead th {
      background: #f8fafc;
      color: var(--slate-600);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.04em;
      padding: 12px 10px;
      border-bottom: 1px solid var(--slate-200);
      position: sticky;
      top: 0;
      z-index: 10;
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
    }
    thead th:hover {
      background: #f1f5f9;
      color: var(--slate-900);
    }
    tbody tr {
      border-bottom: 1px solid var(--slate-100);
      transition: background-color 0.15s;
    }
    tbody tr:hover {
      background: #f8fafc;
    }
    tbody td {
      padding: 10px;
      vertical-align: middle;
      white-space: nowrap;
    }
    .plate-badge {
      font-family: monospace;
      font-weight: 700;
      color: var(--slate-900);
      background: var(--slate-100);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid var(--slate-200);
    }
    .status-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 0.72rem;
      background: var(--slate-100);
      color: var(--slate-700);
    }
    .status-badge.encostado {
      background: #dcfce7;
      color: #166534;
      border: 1px solid #bbf7d0;
    }
    .status-badge.transito {
      background: #dbeafe;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    }
    .status-badge.aguardando {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .status-badge.oportunidade {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .opp-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.7rem;
    }
    .opp-badge.sim {
      background: #fee2e2;
      color: #b91c1c;
      border: 1px solid #fca5a5;
    }
    .opp-badge.nao {
      background: var(--slate-100);
      color: var(--slate-400);
    }
    .pagination {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--slate-200);
      background: #fafafa;
    }
    .page-controls {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .page-btn {
      padding: 6px 12px;
      font-size: 0.78rem;
      font-weight: 600;
      border: 1px solid var(--slate-200);
      background: #fff;
      border-radius: 6px;
      cursor: pointer;
    }
    .page-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .footer {
      text-align: center;
      padding: 24px;
      font-size: 0.75rem;
      color: var(--slate-400);
    }
    @media print {
      .top-header { position: static; box-shadow: none; border-bottom: 2px solid #da291c; }
      .actions-section, .filter-panel, .pagination { display: none !important; }
      .table-scroll { max-height: none; overflow: visible; }
      body { background: #fff; }
    }
  </style>
</head>
<body>

  <header class="top-header">
    <div class="brand-section">
      <div class="logo-container">
        ${logoSvg}
      </div>
      <div class="title-block">
        <h1>Dashboard de Acompanhamento Sinergia</h1>
        <p>Revenda x Transferência — Visualização Operacional & Gerencial</p>
      </div>
    </div>
    <div class="actions-section">
      <span class="badge-export-time">Exportado em: ${dateStr} às ${timeStr}</span>
      <button class="btn btn-outline" onclick="window.print()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
        Imprimir / PDF
      </button>
      <button class="btn btn-red" onclick="downloadFilteredCsv()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        Baixar CSV Filtrado
      </button>
    </div>
  </header>

  <main class="main-container">
    <!-- KPIs -->
    <div class="kpi-grid">
      <div class="kpi-card highlight">
        <div class="kpi-title">Total Veículos</div>
        <div class="kpi-value" id="kpi-total">${totalVehicles}</div>
        <div class="kpi-sub">Frota monitorada</div>
      </div>
      <div class="kpi-card amber">
        <div class="kpi-title">Oportunidades</div>
        <div class="kpi-value" id="kpi-opp">${oportunidades}</div>
        <div class="kpi-sub">${totalVehicles > 0 ? ((oportunidades / totalVehicles) * 100).toFixed(1) : 0}% da base</div>
      </div>
      <div class="kpi-card green">
        <div class="kpi-title">Encostados</div>
        <div class="kpi-value" id="kpi-encostados">${encostados}</div>
        <div class="kpi-sub">Na unidade de destino</div>
      </div>
      <div class="kpi-card blue">
        <div class="kpi-title">Em Trânsito</div>
        <div class="kpi-value" id="kpi-transito">${emTransito}</div>
        <div class="kpi-sub">Em deslocamento</div>
      </div>
      <div class="kpi-card purple">
        <div class="kpi-title">Aguard. Descarga</div>
        <div class="kpi-value" id="kpi-aguardando">${aguardandoDescarga}</div>
        <div class="kpi-sub">Fila operacional</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-title">Total Paletes</div>
        <div class="kpi-value" id="kpi-paletes">${totalPaletes.toLocaleString('pt-BR')}</div>
        <div class="kpi-sub">Volume total</div>
      </div>
    </div>

    <!-- Insights / Distribuição -->
    <div class="insights-grid">
      <div class="insight-card">
        <div class="insight-header">
          <span>Distribuição por Status</span>
          <small style="color:var(--slate-400)">Top ocorrências</small>
        </div>
        <div id="status-distribution">
          ${Object.entries(statusCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([status, count]) => {
              const pct = totalVehicles > 0 ? ((count / totalVehicles) * 100).toFixed(1) : '0';
              let barClass = '';
              if (/encostad/i.test(status)) barClass = 'green';
              else if (/tr[aâ]nsit/i.test(status)) barClass = 'blue';
              else if (/aguardando/i.test(status)) barClass = 'amber';
              return `
                <div class="bar-row">
                  <div class="bar-label" title="${status}">${status}</div>
                  <div class="bar-container">
                    <div class="bar-fill ${barClass}" style="width: ${pct}%"></div>
                  </div>
                  <div class="bar-count">${count}</div>
                </div>
              `;
            }).join('')}
        </div>
      </div>

      <div class="insight-card">
        <div class="insight-header">
          <span>Top Unidades por Veículos</span>
          <small style="color:var(--slate-400)">Principais polos</small>
        </div>
        <div id="unit-distribution">
          ${Object.entries(unitCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([unit, count]) => {
              const pct = totalVehicles > 0 ? ((count / totalVehicles) * 100).toFixed(1) : '0';
              return `
                <div class="bar-row">
                  <div class="bar-label" title="${unit}">${unit}</div>
                  <div class="bar-container">
                    <div class="bar-fill blue" style="width: ${pct}%"></div>
                  </div>
                  <div class="bar-count">${count}</div>
                </div>
              `;
            }).join('')}
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-panel">
      <div class="search-box">
        <span class="search-icon">🔍</span>
        <input type="text" id="search-input" placeholder="Pesquisar por Placa, Motorista, Transportador, NF, Unidade..." oninput="onFilterChange()">
      </div>

      <select id="filter-unit" class="filter-select" onchange="onFilterChange()">
        <option value="">Todas as Unidades</option>
      </select>

      <select id="filter-status" class="filter-select" onchange="onFilterChange()">
        <option value="">Todos os Status</option>
      </select>

      <select id="filter-region" class="filter-select" onchange="onFilterChange()">
        <option value="">Todas as Regiões</option>
      </select>

      <label class="filter-toggle">
        <input type="checkbox" id="toggle-opp" onchange="onFilterChange()">
        <span>Apenas Oportunidades</span>
      </label>

      <button class="btn btn-outline" onclick="resetFilters()">Limpar</button>

      <div class="filter-info" id="filter-summary">
        Mostrando <span id="filtered-count">${totalVehicles}</span> de ${totalVehicles} veículos
      </div>
    </div>

    <!-- Main Table -->
    <div class="table-container">
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th onclick="sortTable('cavalo')">Placa / Cavalo ⬍</th>
              <th onclick="sortTable('carretas')">Carretas ⬍</th>
              <th onclick="sortTable('motorista')">Motorista ⬍</th>
              <th onclick="sortTable('transportador')">Transportador ⬍</th>
              <th onclick="sortTable('unidade')">Unidade ⬍</th>
              <th onclick="sortTable('regiao')">Região ⬍</th>
              <th onclick="sortTable('status')">Status ⬍</th>
              <th onclick="sortTable('isOportunidade')">Oportunidade ⬍</th>
              <th onclick="sortTable('palletes')" style="text-align:center">Paletes ⬍</th>
              <th>Previsão Unidade</th>
              <th>Chegada Unidade</th>
              <th>Saída Unidade</th>
              <th>NF</th>
              <th>Fornecedor</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody id="table-body">
            <!-- Rendered by JavaScript -->
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <div style="font-size:0.75rem; color:var(--slate-500)" id="pagination-info">
          Página 1 de 1
        </div>
        <div class="page-controls">
          <select id="page-size" class="filter-select" style="padding:4px 8px; font-size:0.75rem;" onchange="changePageSize()">
            <option value="25">25 por página</option>
            <option value="50">50 por página</option>
            <option value="100">100 por página</option>
            <option value="99999">Exibir Todos</option>
          </select>
          <button class="page-btn" id="btn-prev" onclick="changePage(-1)">Anterior</button>
          <button class="page-btn" id="btn-next" onclick="changePage(1)">Próxima</button>
        </div>
      </div>
    </div>
  </main>

  <footer class="footer">
    Solar Coca-Cola • Sistema de Acompanhamento Operacional Sinergia • Gerado automaticamente para equipes de logística e planejamento.
  </footer>

  <script>
    const RAW_DATA = ${vehiclesJson};
    let filteredData = [...RAW_DATA];
    let sortField = 'cavalo';
    let sortAsc = true;
    let currentPage = 1;
    let pageSize = 25;

    // Initialize Dropdowns
    function initDropdowns() {
      const units = [...new Set(RAW_DATA.map(v => v.unidade).filter(Boolean))].sort();
      const unitSelect = document.getElementById('filter-unit');
      units.forEach(u => {
        const count = RAW_DATA.filter(v => v.unidade === u).length;
        const opt = document.createElement('option');
        opt.value = u;
        opt.textContent = u + ' (' + count + ')';
        unitSelect.appendChild(opt);
      });

      const statuses = [...new Set(RAW_DATA.map(v => v.status).filter(Boolean))].sort();
      const statusSelect = document.getElementById('filter-status');
      statuses.forEach(s => {
        const count = RAW_DATA.filter(v => v.status === s).length;
        const opt = document.createElement('option');
        opt.value = s;
        opt.textContent = s + ' (' + count + ')';
        statusSelect.appendChild(opt);
      });

      const regions = [...new Set(RAW_DATA.map(v => v.regiao).filter(Boolean))].sort();
      const regionSelect = document.getElementById('filter-region');
      regions.forEach(r => {
        const count = RAW_DATA.filter(v => v.regiao === r).length;
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r + ' (' + count + ')';
        regionSelect.appendChild(opt);
      });
    }

    function onFilterChange() {
      const q = (document.getElementById('search-input').value || '').toLowerCase().trim();
      const unit = document.getElementById('filter-unit').value;
      const status = document.getElementById('filter-status').value;
      const region = document.getElementById('filter-region').value;
      const onlyOpp = document.getElementById('toggle-opp').checked;

      filteredData = RAW_DATA.filter(v => {
        if (unit && v.unidade !== unit) return false;
        if (status && v.status !== status) return false;
        if (region && v.regiao !== region) return false;
        if (onlyOpp && !v.isOportunidade) return false;

        if (q) {
          const match = (v.cavalo || '').toLowerCase().includes(q) ||
            (v.carretas || '').toLowerCase().includes(q) ||
            (v.motorista || '').toLowerCase().includes(q) ||
            (v.transportador || '').toLowerCase().includes(q) ||
            (v.unidade || '').toLowerCase().includes(q) ||
            (v.fornecedor || '').toLowerCase().includes(q) ||
            (v.nf || '').toLowerCase().includes(q) ||
            (v.observacao || '').toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      });

      currentPage = 1;
      applySort();
      updateKpis();
      renderTable();
    }

    function resetFilters() {
      document.getElementById('search-input').value = '';
      document.getElementById('filter-unit').value = '';
      document.getElementById('filter-status').value = '';
      document.getElementById('filter-region').value = '';
      document.getElementById('toggle-opp').checked = false;
      onFilterChange();
    }

    function sortTable(field) {
      if (sortField === field) {
        sortAsc = !sortAsc;
      } else {
        sortField = field;
        sortAsc = true;
      }
      applySort();
      renderTable();
    }

    function applySort() {
      filteredData.sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        valA = (valA || '').toString().toLowerCase();
        valB = (valB || '').toString().toLowerCase();
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
    }

    function updateKpis() {
      document.getElementById('filtered-count').textContent = filteredData.length;
      document.getElementById('kpi-total').textContent = filteredData.length;
      const opp = filteredData.filter(v => v.isOportunidade).length;
      document.getElementById('kpi-opp').textContent = opp;
      const enc = filteredData.filter(v => /encostad/i.test(v.status)).length;
      document.getElementById('kpi-encostados').textContent = enc;
      const tra = filteredData.filter(v => /tr[aâ]nsit/i.test(v.status)).length;
      document.getElementById('kpi-transito').textContent = tra;
      const agu = filteredData.filter(v => /aguardando descarga/i.test(v.status)).length;
      document.getElementById('kpi-aguardando').textContent = agu;
      const pal = filteredData.reduce((acc, v) => acc + (Number(v.palletes) || 0), 0);
      document.getElementById('kpi-paletes').textContent = pal.toLocaleString('pt-BR');
    }

    function renderTable() {
      const tbody = document.getElementById('table-body');
      tbody.innerHTML = '';

      const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
      if (currentPage > totalPages) currentPage = totalPages;

      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      const pageData = filteredData.slice(start, end);

      if (pageData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="15" style="text-align:center; padding:32px; color:var(--slate-400)">Nenhum veículo encontrado com os filtros selecionados.</td></tr>';
      } else {
        pageData.forEach(v => {
          const tr = document.createElement('tr');
          let statusClass = '';
          if (/encostad/i.test(v.status)) statusClass = 'encostado';
          else if (/tr[aâ]nsit/i.test(v.status)) statusClass = 'transito';
          else if (/aguardando/i.test(v.status)) statusClass = 'aguardando';
          else if (v.isOportunidade) statusClass = 'oportunidade';

          tr.innerHTML = \`
            <td><span class="plate-badge">\${v.cavalo || '-'}</span></td>
            <td>\${v.carretas || '-'}</td>
            <td style="font-weight:600; color:var(--slate-800)">\${v.motorista || '-'}</td>
            <td>\${v.transportador || '-'}</td>
            <td style="font-weight:700; color:var(--slate-900)">\${v.unidade || '-'}</td>
            <td>\${v.regiao || '-'}</td>
            <td><span class="status-badge \${statusClass}">\${v.status || '-'}</span></td>
            <td><span class="opp-badge \${v.isOportunidade ? 'sim' : 'nao'}">\${v.isOportunidade ? 'SIM' : 'NÃO'}</span></td>
            <td style="text-align:center; font-weight:700">\${v.palletes > 0 ? v.palletes : '-'}</td>
            <td style="color:var(--slate-600)">\${v.previsaoUnidade || '-'}</td>
            <td style="color:var(--slate-600)">\${v.chegadaUnidade || '-'}</td>
            <td style="color:var(--slate-600)">\${v.saidaUnidade || '-'}</td>
            <td style="font-family:monospace; color:var(--slate-500)">\${v.nf || '-'}</td>
            <td style="color:var(--slate-600)">\${v.fornecedor || '-'}</td>
            <td style="color:var(--slate-500); max-width:240px; overflow:hidden; text-overflow:ellipsis" title="\${v.observacao || ''}">\${v.observacao || '-'}</td>
          \`;
          tbody.appendChild(tr);
        });
      }

      document.getElementById('pagination-info').textContent = \`Página \${currentPage} de \${totalPages} (\${filteredData.length} registros)\`;
      document.getElementById('btn-prev').disabled = currentPage <= 1;
      document.getElementById('btn-next').disabled = currentPage >= totalPages;
    }

    function changePage(delta) {
      currentPage += delta;
      renderTable();
    }

    function changePageSize() {
      pageSize = parseInt(document.getElementById('page-size').value, 10);
      currentPage = 1;
      renderTable();
    }

    function downloadFilteredCsv() {
      const headers = ['Cavalo', 'Carretas', 'Motorista', 'Transportador', 'Status', 'Unidade', 'Regiao', 'Oportunidade', 'NF', 'Palletes', 'Fornecedor', 'Carga programada', 'Previsao unidade', 'Chegada unidade', 'Saida unidade', 'Observacao'];
      const rows = filteredData.map(v => [
        '"' + (v.cavalo || '') + '"',
        '"' + (v.carretas || '') + '"',
        '"' + (v.motorista || '') + '"',
        '"' + (v.transportador || '') + '"',
        '"' + (v.status || '') + '"',
        '"' + (v.unidade || '') + '"',
        '"' + (v.regiao || '') + '"',
        '"' + (v.isOportunidade ? 'Sim' : 'Não') + '"',
        '"' + (v.nf || '') + '"',
        v.palletes || 0,
        '"' + (v.fornecedor || '') + '"',
        '"' + (v.cargaProgramada || '') + '"',
        '"' + (v.previsaoUnidade || '') + '"',
        '"' + (v.chegadaUnidade || '') + '"',
        '"' + (v.saidaUnidade || '') + '"',
        '"' + (v.observacao || '').replace(/"/g, '""') + '"'
      ].join(';'));

      const csvContent = '\\uFEFF' + [headers.join(';'), ...rows].join('\\r\\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'veiculos_filtrados_solar.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // Initialize
    initDropdowns();
    applySort();
    renderTable();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
