import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { AshtakootScore } from '../types/astrology';
import { Sparkles, Info, Award, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AshtakootRadarChartProps {
  scores: AshtakootScore[];
  totalScore: number;
  compatibilityLevel: string;
}

interface RadarDataPoint {
  axis: string;
  hindiName: string;
  obtained: number;
  max: number;
  percentage: number;
  area: string;
  verdict: string;
  explanation: string;
}

export const AshtakootRadarChart: React.FC<AshtakootRadarChartProps> = ({
  scores,
  totalScore,
  compatibilityLevel,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<RadarDataPoint | null>(null);

  // Normalize scores to RadarDataPoints
  const data: RadarDataPoint[] = scores.map((s) => {
    const pct = s.maximumPoints > 0 ? (s.obtainedPoints / s.maximumPoints) * 100 : 0;
    return {
      axis: s.name,
      hindiName: s.hindiName || '',
      obtained: s.obtainedPoints,
      max: s.maximumPoints,
      percentage: Math.min(100, Math.max(0, pct)),
      area: s.area,
      verdict: s.verdict,
      explanation: s.explanation,
    };
  });

  useEffect(() => {
    if (!svgRef.current || !data || data.length === 0) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 500;
    const height = 460;
    const margin = { top: 55, right: 75, bottom: 55, left: 75 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const radius = Math.min(innerWidth, innerHeight) / 2;

    const svg = d3
      .select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .style('overflow', 'visible');

    // Defs for gradients & filters
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'glow');
    filter
      .append('feGaussianBlur')
      .attr('stdDeviation', '3.5')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Area Radial Gradient
    const gradient = defs
      .append('radialGradient')
      .attr('id', 'radarGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');

    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#F59E0B')
      .attr('stop-opacity', '0.7');

    gradient
      .append('stop')
      .attr('offset', '65%')
      .attr('stop-color', '#EC4899')
      .attr('stop-opacity', '0.4');

    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#8B5CF6')
      .attr('stop-opacity', '0.15');

    const g = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const angleSlice = (Math.PI * 2) / data.length;
    const rScale = d3.scaleLinear().domain([0, 100]).range([0, radius]);

    // Draw Concentric Grid Levels (25%, 50%, 75%, 100%)
    const levels = [25, 50, 75, 100];
    const gridG = g.append('g').attr('class', 'grid-levels');

    levels.forEach((level) => {
      const levelRadius = rScale(level);

      // Generate polygon coordinates for each level
      const points: [number, number][] = data.map((_, i) => [
        levelRadius * Math.cos(angleSlice * i - Math.PI / 2),
        levelRadius * Math.sin(angleSlice * i - Math.PI / 2),
      ]);

      gridG
        .append('polygon')
        .attr('points', points.map((p) => p.join(',')).join(' '))
        .attr('fill', level === 100 ? 'rgba(245, 158, 11, 0.03)' : 'none')
        .attr('stroke', 'rgba(255, 255, 255, 0.12)')
        .attr('stroke-width', level === 100 ? '1.5' : '1')
        .attr('stroke-dasharray', level === 100 ? 'none' : '3,3');

      // Level label
      gridG
        .append('text')
        .attr('x', 6)
        .attr('y', -levelRadius)
        .attr('fill', 'rgba(255, 255, 255, 0.35)')
        .attr('font-size', '9px')
        .attr('font-family', 'monospace')
        .text(`${level}%`);
    });

    // Draw Radial Axis Lines & Labels
    const axesG = g.append('g').attr('class', 'axes');

    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      // Axis Line
      axesG
        .append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', x)
        .attr('y2', y)
        .attr('stroke', 'rgba(255, 255, 255, 0.15)')
        .attr('stroke-width', '1');

      // Outer Axis Label
      const labelDistance = radius + 22;
      const labelX = labelDistance * Math.cos(angle);
      const labelY = labelDistance * Math.sin(angle);

      const isRight = labelX > 5;
      const isLeft = labelX < -5;
      const anchor = isRight ? 'start' : isLeft ? 'end' : 'middle';

      const labelGroup = axesG
        .append('g')
        .attr('transform', `translate(${labelX}, ${labelY})`)
        .style('cursor', 'pointer')
        .on('mouseenter', () => setHoveredPoint(d))
        .on('mouseleave', () => setHoveredPoint(null));

      // Title
      labelGroup
        .append('text')
        .attr('text-anchor', anchor)
        .attr('dy', '-0.3em')
        .attr('fill', '#E2E8F0')
        .attr('font-size', '11px')
        .attr('font-weight', '600')
        .text(d.axis);

      // Score Pill text
      labelGroup
        .append('text')
        .attr('text-anchor', anchor)
        .attr('dy', '1em')
        .attr('fill', d.percentage >= 70 ? '#34D399' : d.percentage >= 40 ? '#FBBF24' : '#F87171')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .text(`${d.obtained}/${d.max} pts (${Math.round(d.percentage)}%)`);
    });

    // Draw Ideal Benchmark 100% Polygon (dotted subtle baseline)
    const idealPoints: [number, number][] = data.map((_, i) => [
      rScale(100) * Math.cos(angleSlice * i - Math.PI / 2),
      rScale(100) * Math.sin(angleSlice * i - Math.PI / 2),
    ]);

    g.append('polygon')
      .attr('points', idealPoints.map((p) => p.join(',')).join(' '))
      .attr('fill', 'none')
      .attr('stroke', 'rgba(56, 189, 248, 0.3)')
      .attr('stroke-width', '1.5')
      .attr('stroke-dasharray', '4,4');

    // Draw Obtained Score Polygon
    const radarLine = d3
      .lineRadial<RadarDataPoint>()
      .radius((d) => rScale(d.percentage))
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    const pathString = radarLine(data) || '';

    // Area
    g.append('path')
      .datum(data)
      .attr('d', pathString)
      .attr('fill', 'url(#radarGradient)')
      .attr('stroke', '#F59E0B')
      .attr('stroke-width', '2.5')
      .attr('filter', 'url(#glow)')
      .attr('opacity', 0)
      .transition()
      .duration(900)
      .ease(d3.easeCubicOut)
      .attr('opacity', 0.95);

    // Data Point Vertex Circles
    const pointsG = g.append('g').attr('class', 'points');

    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI / 2;
      const x = rScale(d.percentage) * Math.cos(angle);
      const y = rScale(d.percentage) * Math.sin(angle);

      // Outer ripple
      pointsG
        .append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 5)
        .attr('fill', '#F59E0B')
        .attr('stroke', '#18181B')
        .attr('stroke-width', '2')
        .style('cursor', 'pointer')
        .on('mouseenter', function () {
          d3.select(this).transition().duration(200).attr('r', 8).attr('fill', '#FBBF24');
          setHoveredPoint(d);
        })
        .on('mouseleave', function () {
          d3.select(this).transition().duration(200).attr('r', 5).attr('fill', '#F59E0B');
          setHoveredPoint(null);
        });
    });
  }, [scores]);

  return (
    <div ref={containerRef} className="space-y-4">
      {/* Radar Chart Container */}
      <div className="relative bg-gradient-to-b from-[#0F1424] via-[#0A0D18] to-[#060810] border border-amber-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center">
        
        {/* Top Header & Compatibility Score Badge */}
        <div className="w-full flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif text-sm font-bold text-stone-100">
                Ashtakoot Radar Matrix (अष्टकूट चक्र)
              </h3>
              <p className="text-[10px] text-stone-400">
                Multi-dimensional 8-Koota mathematical balance visualization
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-xs font-mono font-bold text-amber-300">
                {totalScore} / 36 Gunas
              </div>
              <div className="text-[10px] text-stone-400">
                {Math.round((totalScore / 36) * 100)}% Harmony
              </div>
            </div>
          </div>
        </div>

        {/* The D3 SVG Radar Canvas */}
        <div className="w-full max-w-[460px] aspect-[500/460] my-2 relative">
          <svg ref={svgRef} className="w-full h-full" />
        </div>

        {/* Legend */}
        <div className="w-full flex flex-wrap items-center justify-center gap-4 pt-3 border-t border-stone-800/80 text-[11px] text-stone-300">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span>Couple&apos;s Guna Alignment ({totalScore}/36)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-sky-400" />
            <span className="text-stone-400">Parashara 100% Ideal Benchmark</span>
          </div>
        </div>

        {/* Dynamic Tooltip / Spotlight Card */}
        {hoveredPoint ? (
          <div className="w-full mt-4 p-4 rounded-2xl bg-stone-950 border border-amber-500/40 animate-fadeIn space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-stone-100 text-sm">
                  {hoveredPoint.axis} {hoveredPoint.hindiName && `(${hoveredPoint.hindiName})`}
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {hoveredPoint.area}
                </span>
              </div>
              <div className="font-mono text-xs font-bold text-emerald-400">
                {hoveredPoint.obtained} / {hoveredPoint.max} Points ({Math.round(hoveredPoint.percentage)}%)
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              {hoveredPoint.explanation}
            </p>

            <div className="flex items-center gap-2 text-[10px] text-stone-400 pt-1 border-t border-stone-900">
              <Info className="w-3 h-3 text-amber-400" />
              <span>Verdict: <strong className="text-stone-200">{hoveredPoint.verdict}</strong></span>
            </div>
          </div>
        ) : (
          <div className="w-full mt-4 p-3 rounded-2xl bg-stone-950/60 border border-stone-800 text-[11px] text-stone-400 text-center italic">
            💡 Hover over any vertex circle or axis label above to inspect detailed Parashara psychological & biological compatibility.
          </div>
        )}

      </div>
    </div>
  );
};
