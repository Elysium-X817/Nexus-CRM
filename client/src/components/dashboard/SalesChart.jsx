import React, { useState } from 'react';
import { BarChart2, TrendingUp, DollarSign } from 'lucide-react';

export const SalesChart = ({ monthlySales = [] }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Compute maximum revenue to scale bars
  const revenues = monthlySales.map((m) => m.revenue || 0);
  const maxRevenue = Math.max(...revenues, 10000);
  const totalPeriodRevenue = revenues.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-monokai-panel border border-monokai-border rounded-xl p-6 shadow-monokai-card flex flex-col h-full">
      {/* Chart Header */}
      <div className="flex items-center justify-between pb-4 border-b border-monokai-border mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 size={18} className="text-teal-400" />
            <h3 className="text-base font-semibold text-monokai-text">Monthly Sales Performance</h3>
          </div>
          <p className="text-xs text-monokai-muted mt-0.5">
            Revenue from closed-won deals across recent months
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs uppercase font-medium text-monokai-dim block">6-Month Total</span>
          <span className="text-lg font-bold text-teal-400 font-mono">
            ${totalPeriodRevenue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* SVG Bar Chart with Hover Tooltips */}
      <div className="flex-1 flex flex-col justify-end min-h-[220px] relative pt-6 pb-2">
        {/* Y-Axis Guideline values */}
        <div className="absolute inset-x-0 top-0 flex justify-between text-[10px] text-monokai-dim font-mono border-b border-monokai-border/40 pb-1">
          <span>Target: ${(maxRevenue).toLocaleString()}</span>
          <span>Mid: ${(maxRevenue / 2).toLocaleString()}</span>
          <span>$0</span>
        </div>

        {/* Bars Container */}
        <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-44 mt-6 px-2">
          {monthlySales.map((item, index) => {
            const heightPercent = Math.max(Math.round((item.revenue / maxRevenue) * 100), 4);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={index}
                className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute -top-14 z-30 bg-monokai-darker border border-teal-500/50 rounded-lg px-2.5 py-1.5 shadow-xl text-center pointer-events-none whitespace-nowrap animate-fade-in">
                    <p className="text-[11px] font-bold text-teal-400 font-mono">
                      ${Number(item.revenue).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-monokai-muted">
                      {item.count} deal{item.count !== 1 ? 's' : ''} won
                    </p>
                  </div>
                )}

                {/* The Bar */}
                <div className="w-full max-w-[48px] bg-monokai-subpanel rounded-t-md overflow-hidden flex flex-col justify-end transition-all h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-500 ease-out flex items-center justify-center ${
                      isHovered
                        ? 'bg-gradient-to-t from-teal-500 to-teal-300 shadow-teal-glow'
                        : 'bg-gradient-to-t from-teal-700/80 to-teal-500 hover:from-teal-600 hover:to-teal-400'
                    }`}
                  >
                    {heightPercent > 35 && (
                      <span className="text-[10px] font-mono font-bold text-monokai-darker rotate-[-90deg] sm:rotate-0 tracking-tighter">
                        ${Math.round(item.revenue / 1000)}k
                      </span>
                    )}
                  </div>
                </div>

                {/* X-Axis Label */}
                <span className={`text-[11px] font-medium mt-2 transition-colors ${
                  isHovered ? 'text-teal-400 font-semibold' : 'text-monokai-muted'
                }`}>
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend & Summary note */}
      <div className="mt-4 pt-3 border-t border-monokai-border/60 flex items-center justify-between text-xs text-monokai-dim">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm bg-teal-500" />
          <span>Closed Won Revenue</span>
        </div>
        <span className="text-[11px] text-monokai-muted">
          Pipedrive pipeline sync active
        </span>
      </div>
    </div>
  );
};
