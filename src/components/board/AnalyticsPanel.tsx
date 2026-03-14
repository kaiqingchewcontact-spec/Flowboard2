import { useState, useEffect } from 'react';
import { Eye, MousePointerClick, TrendingUp, BarChart3 } from 'lucide-react';

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  dailyViews: Record<string, number>;
  topCards: { id: string; title: string; clicks: number }[];
}

interface AnalyticsPanelProps {
  boardId: string;
}

export default function AnalyticsPanel({ boardId }: AnalyticsPanelProps) {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics?board_id=${boardId}&days=${days}`);
        const json = await res.json();
        if (json.data) setData(json.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [boardId, days]);

  if (loading) {
    return (
      <div className="card-base p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-flow-accent" />
          <h3 className="font-display text-sm text-flow-ink">Analytics</h3>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-flow-border rounded-lg" />
            <div className="h-20 bg-flow-border rounded-lg" />
          </div>
          <div className="h-32 bg-flow-border rounded-lg" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Build sparkline from daily views
  const sortedDays = Object.entries(data.dailyViews).sort(([a], [b]) => a.localeCompare(b));
  const maxViews = Math.max(...sortedDays.map(([, v]) => v), 1);

  // CTR
  const ctr = data.totalViews > 0
    ? ((data.totalClicks / data.totalViews) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="card-base p-6 mb-8">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 size={16} className="text-flow-accent" />
          <h3 className="font-display text-sm text-flow-ink">Analytics</h3>
        </div>
        <div className="flex items-center gap-1">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors
                         ${days === d
                           ? 'bg-flow-ink text-flow-paper'
                           : 'text-flow-muted hover:bg-flow-warm'
                         }`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-flow-warm rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <Eye size={13} className="text-flow-muted" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-flow-muted">
              Views
            </span>
          </div>
          <span className="font-display text-2xl text-flow-ink">
            {data.totalViews.toLocaleString()}
          </span>
        </div>
        <div className="bg-flow-warm rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <MousePointerClick size={13} className="text-flow-muted" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-flow-muted">
              Clicks
            </span>
          </div>
          <span className="font-display text-2xl text-flow-ink">
            {data.totalClicks.toLocaleString()}
          </span>
        </div>
        <div className="bg-flow-warm rounded-lg p-4">
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp size={13} className="text-flow-muted" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-flow-muted">
              CTR
            </span>
          </div>
          <span className="font-display text-2xl text-flow-ink">{ctr}%</span>
        </div>
      </div>

      {/* Mini bar chart */}
      {sortedDays.length > 0 && (
        <div className="mb-5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-flow-muted mb-2 block">
            Daily views
          </span>
          <div className="flex items-end gap-[2px] h-16">
            {sortedDays.map(([day, count]) => (
              <div
                key={day}
                className="flex-1 bg-flow-accent/20 hover:bg-flow-accent/40 rounded-sm 
                           transition-colors cursor-pointer relative group"
                style={{ height: `${(count / maxViews) * 100}%`, minHeight: '2px' }}
                title={`${day}: ${count} views`}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-flow-ink text-flow-paper 
                                text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap
                                opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {count}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top cards */}
      {data.topCards.length > 0 && (
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-flow-muted mb-2 block">
            Top content
          </span>
          <div className="space-y-1.5">
            {data.topCards.map((card, i) => (
              <div
                key={card.id}
                className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-flow-warm transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono text-flow-muted w-4">{i + 1}</span>
                  <span className="text-sm text-flow-ink truncate">{card.title}</span>
                </div>
                <span className="text-xs font-mono text-flow-muted flex-shrink-0 ml-2">
                  {card.clicks} clicks
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.totalViews === 0 && data.totalClicks === 0 && (
        <p className="text-sm text-flow-muted text-center py-4">
          No data yet. Publish your board and share the link to start tracking.
        </p>
      )}
    </div>
  );
}

