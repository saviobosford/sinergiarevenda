import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Building2,
  Navigation,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  Eye,
} from 'lucide-react';
import { ProcessedVehicle, RegionName, UnitLocation } from '../types';
import { REGION_CENTERS } from '../utils/constants';
import { getResolvedUnitLocation } from '../utils/cityGeocoding';

interface LogisticsMapProps {
  vehicles: ProcessedVehicle[];
  selectedRegion: RegionName | 'Todas';
  onSelectRegion: (regiao: RegionName | 'Todas') => void;
  onOpenRegionDrillDown: (regiao: RegionName) => void;
  onOpenUnitDrillDown: (unidade: string) => void;
}

export const LogisticsMap: React.FC<LogisticsMapProps> = ({
  vehicles,
  selectedRegion,
  onSelectRegion,
  onOpenRegionDrillDown,
  onOpenUnitDrillDown,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [activeTab, setActiveTab] = useState<'regioes' | 'unidades' | 'transportadoras'>('regioes');
  const [isExpanded, setIsExpanded] = useState(false);

  // 1. Calculate Quantity by Region
  const regionStats = useMemo(() => {
    const stats: Record<RegionName, { count: number; unidades: Set<string>; transportadoras: Set<string> }> = {
      Nordeste: { count: 0, unidades: new Set(), transportadoras: new Set() },
      Norte: { count: 0, unidades: new Set(), transportadoras: new Set() },
      'Centro-Oeste': { count: 0, unidades: new Set(), transportadoras: new Set() },
      Sudeste: { count: 0, unidades: new Set(), transportadoras: new Set() },
      Sul: { count: 0, unidades: new Set(), transportadoras: new Set() },
      Outras: { count: 0, unidades: new Set(), transportadoras: new Set() },
    };

    vehicles.forEach(v => {
      const reg = v.regiao || 'Outras';
      if (!stats[reg]) {
        stats[reg] = { count: 0, unidades: new Set(), transportadoras: new Set() };
      }
      stats[reg].count++;
      if (v.unidade) stats[reg].unidades.add(v.unidade);
      if (v.transportador) stats[reg].transportadoras.add(v.transportador);
    });

    return stats;
  }, [vehicles]);

  // 2. Calculate Quantity by Unit
  const unitStats = useMemo(() => {
    const map = new Map<string, {
      code: string;
      displayName: string;
      region: RegionName;
      count: number;
      carriers: Map<string, number>;
      vehicles: ProcessedVehicle[];
      location: UnitLocation;
    }>();

    vehicles.forEach(v => {
      const un = v.unidade || 'N/D';
      if (!map.has(un)) {
        const resolved = getResolvedUnitLocation(un, v.regiao);
        map.set(un, {
          code: un,
          displayName: resolved.name || un,
          region: v.regiao || resolved.region,
          count: 0,
          carriers: new Map(),
          vehicles: [],
          location: resolved,
        });
      }
      const entry = map.get(un)!;
      entry.count++;
      entry.vehicles.push(v);
      const carrier = v.transportador || 'Outro';
      entry.carriers.set(carrier, (entry.carriers.get(carrier) || 0) + 1);
    });

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [vehicles]);

  // 3. Calculate Quantity by Carrier
  const carrierStats = useMemo(() => {
    const map = new Map<string, { name: string; count: number; regions: Set<RegionName>; units: Set<string> }>();

    vehicles.forEach(v => {
      const carrier = v.transportador || 'Não informado';
      if (!map.has(carrier)) {
        map.set(carrier, { name: carrier, count: 0, regions: new Set(), units: new Set() });
      }
      const entry = map.get(carrier)!;
      entry.count++;
      entry.regions.add(v.regiao);
      entry.units.add(v.unidade);
    });

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }, [vehicles]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-14.235, -51.9253],
        zoom: 4,
        minZoom: 3,
        maxZoom: 14,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Map Markers when data or selected region changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // Determine filtered units
    const filteredUnits = selectedRegion === 'Todas'
      ? unitStats
      : unitStats.filter(u => u.region === selectedRegion);

    const bounds = L.latLngBounds([]);

    filteredUnits.forEach(u => {
      // Find coordinates or approximate based on region center
      let lat = u.location?.lat;
      let lng = u.location?.lng;

      if (!lat || !lng || (lat === -14.235 && lng === -51.9253)) {
        const resolved = getResolvedUnitLocation(u.code, u.region);
        lat = resolved.lat;
        lng = resolved.lng;
      }

      bounds.extend([lat, lng]);

      // Pick color based on region
      const regMeta = REGION_CENTERS[u.region] || REGION_CENTERS['Outras'];
      const color = regMeta.color;
      const safeId = `popup-btn-${u.code.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // Custom HTML Pin DivIcon
      const pinHtml = `
        <div style="
          background-color: ${color};
          color: white;
          border: 2px solid white;
          border-radius: 9999px;
          padding: 2px 7px;
          font-weight: 700;
          font-size: 11px;
          font-family: sans-serif;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
          transform: translate(-50%, -50%);
          cursor: pointer;
        ">
          <span>${u.code}</span>
          <span style="background: rgba(255,255,255,0.3); padding: 1px 5px; border-radius: 999px; font-size: 10px;">${u.count}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: pinHtml,
        iconSize: [60, 24],
        iconAnchor: [30, 12],
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      // Create popup with carrier breakdown and drill-down buttons
      const topCarriers = Array.from(u.carriers.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, c]) => `<div style="display:flex; justify-content:space-between; font-size:11px; margin-top:2px;"><span>${name}</span><strong>${c}</strong></div>`)
        .join('');

      const citySub = u.displayName && u.displayName !== u.code
        ? `<div style="font-size: 11px; color: #475569; margin-bottom: 4px;">📍 ${u.displayName}</div>`
        : '';

      const popupContent = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 190px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #0f172a;">${u.code}</strong>
            <span style="font-size: 10px; background: ${color}20; color: ${color}; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${u.region}</span>
          </div>
          ${citySub}
          <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">
            Total de Veículos: <strong style="color: #0f172a;">${u.count}</strong>
          </div>
          <div style="margin-bottom: 8px;">
            <div style="font-size: 10px; font-weight: 600; color: #64748b; text-transform: uppercase;">Top Transportadoras:</div>
            ${topCarriers}
          </div>
          <button
            id="${safeId}"
            style="
              width: 100%;
              background: #2563eb;
              color: white;
              border: none;
              padding: 6px 8px;
              border-radius: 6px;
              font-size: 11px;
              font-weight: 600;
              cursor: pointer;
            "
          >
            Abrir Detalhes da Unidade ➔
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(safeId);
        if (btn) {
          btn.onclick = () => {
            onOpenUnitDrillDown(u.code);
          };
        }
      });

      marker.addTo(markersGroup);
    });

    // Fit map bounds if markers exist
    if (filteredUnits.length > 0 && bounds.isValid()) {
      if (selectedRegion !== 'Todas') {
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 8 });
      } else {
        map.setView([-14.235, -51.9253], 4);
      }
    }
  }, [unitStats, selectedRegion, onOpenUnitDrillDown]);

  // Quick zoom to region center
  const handleZoomToRegion = (reg: RegionName) => {
    onSelectRegion(reg);
    const center = REGION_CENTERS[reg];
    if (center && mapInstanceRef.current) {
      mapInstanceRef.current.setView([center.lat, center.lng], center.zoom);
    }
  };

  const handleResetMap = () => {
    onSelectRegion('Todas');
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([-14.235, -51.9253], 4);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Map Header Toolbar */}
      <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">
            Mapa Operacional de Frotas & Unidades
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">
            (Recálculo automático por Região, Unidade e Transportadora)
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleResetMap}
            title="Resetar visão geral do Brasil"
            className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200 bg-white rounded border border-slate-200 transition-colors cursor-pointer"
          >
            Visão Brasil
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Reduzir mapa' : 'Expandir mapa'}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-colors cursor-pointer"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Grid: Map on the left / interactive sidebar rankings on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Map Canvas */}
        <div className={`${isExpanded ? 'lg:col-span-12' : 'lg:col-span-8'} relative`}>
          <div
            ref={mapContainerRef}
            className={`w-full ${isExpanded ? 'h-[580px]' : 'h-[440px]'} z-10`}
          />

          {/* Floating Regional Shortcuts inside Map */}
          <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg shadow-md border border-slate-200 flex flex-wrap gap-1 text-xs">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-1.5 self-center">
              Foco:
            </span>
            {(['Nordeste', 'Norte', 'Centro-Oeste', 'Sudeste', 'Sul'] as RegionName[]).map((r) => {
              const regMeta = REGION_CENTERS[r];
              const isSelected = selectedRegion === r;
              return (
                <button
                  key={r}
                  onClick={() => handleZoomToRegion(r)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? `${regMeta.bgClass} text-white shadow-xs`
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sidebar: Recalculated quantities by Região, Unidade, Transportadora */}
        {!isExpanded && (
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col h-[440px] bg-slate-50/30">
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs">
              <button
                onClick={() => setActiveTab('regioes')}
                className={`flex-1 py-2.5 font-semibold text-center transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'regioes'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Por Região ({Object.keys(regionStats).length})
              </button>
              <button
                onClick={() => setActiveTab('unidades')}
                className={`flex-1 py-2.5 font-semibold text-center transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'unidades'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Por Unidade ({unitStats.length})
              </button>
              <button
                onClick={() => setActiveTab('transportadoras')}
                className={`flex-1 py-2.5 font-semibold text-center transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'transportadoras'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Transportadoras ({carrierStats.length})
              </button>
            </div>

            {/* Tab Contents with Drill-Down Actions */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {/* TAB 1: REGIOES */}
              {activeTab === 'regioes' && (
                <div className="space-y-2">
                  <div className="text-[11px] text-slate-500 px-1">
                    Clique em uma região para abrir a lista detalhada (Drill-Down com Unidades, Transportadoras e Placas):
                  </div>
                  {(['Nordeste', 'Norte', 'Centro-Oeste', 'Sudeste', 'Sul'] as RegionName[]).map((r) => {
                    const st = regionStats[r];
                    const regMeta = REGION_CENTERS[r];
                    const count = st ? st.count : 0;
                    return (
                      <div
                        key={r}
                        className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer group"
                        onClick={() => onOpenRegionDrillDown(r)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full"
                              style={{ backgroundColor: regMeta.color }}
                            />
                            <strong className="text-xs text-slate-900 group-hover:text-blue-600">
                              {r}
                            </strong>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                              {count} veículos
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-1.5">
                          <span>{st?.unidades.size || 0} unidades ativas</span>
                          <span>{st?.transportadoras.size || 0} transportadoras</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* TAB 2: UNIDADES */}
              {activeTab === 'unidades' && (
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-500 px-1">
                    Clique na unidade para abrir a tabela detalhada com placas, motoristas e previsões:
                  </div>
                  {unitStats.slice(0, 30).map((u) => {
                    const regMeta = REGION_CENTERS[u.region] || REGION_CENTERS['Outras'];
                    return (
                      <div
                        key={u.code}
                        className="bg-white px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between group"
                        onClick={() => onOpenUnitDrillDown(u.code)}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                                {u.code}
                              </span>
                              <span
                                className="text-[10px] font-medium px-1.5 py-0.2 rounded"
                                style={{ backgroundColor: `${regMeta.color}15`, color: regMeta.color }}
                              >
                                {u.region}
                              </span>
                            </div>
                            {u.displayName && u.displayName !== u.code && (
                              <div className="text-[10px] text-slate-500">
                                {u.displayName}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
                            {u.count} {u.count === 1 ? 'veículo' : 'veículos'}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                        </div>
                      </div>
                    );
                  })}
                  {unitStats.length > 30 && (
                    <div className="text-center text-[11px] text-slate-400 py-1">
                      + {unitStats.length - 30} outras unidades no arquivo
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: TRANSPORTADORAS */}
              {activeTab === 'transportadoras' && (
                <div className="space-y-1.5">
                  <div className="text-[11px] text-slate-500 px-1">
                    Recálculo por parceiro logístico ativo (BRADO excluído automaticamente):
                  </div>
                  {carrierStats.map((c) => (
                    <div
                      key={c.name}
                      className="bg-white px-3 py-2 rounded-lg border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-xs font-medium text-slate-800 truncate" title={c.name}>
                          {c.name}
                        </span>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                          {c.count} {c.count === 1 ? 'veículo' : 'veículos'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
