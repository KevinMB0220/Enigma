'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Activity, Clock, CheckCircle2, XCircle, Timer } from 'lucide-react';
import { cn } from '@/lib/utils/index';

/**
 * Heartbeat log entry from API
 */
export interface HeartbeatLog {
  id: number;
  timestamp: string;
  challengeType: 'PING' | 'CHALLENGE_RESPONSE';
  result: 'PASS' | 'FAIL' | 'TIMEOUT';
  responseTimeMs: number | null;
  errorMessage: string | null;
}

/**
 * Uptime statistics
 */
export interface UptimeStats {
  percentage: number;
  totalPings: number;
  successfulPings: number;
  failedPings: number;
  timeoutPings: number;
  averageResponseTimeMs: number;
}

interface HeartbeatChartProps {
  logs: HeartbeatLog[];
  stats: UptimeStats;
  period?: '24h' | '7d' | '30d';
  className?: string;
}

/**
 * Format timestamp for chart X-axis
 */
function formatTime(timestamp: string, period: string): string {
  const date = new Date(timestamp);
  if (period === '24h') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

/**
 * Custom tooltip component
 */
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number; payload: { result: string; errorMessage?: string } }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const result = data.payload.result;
  const resultColor = result === 'PASS' ? 'text-green-400' : result === 'TIMEOUT' ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="bg-[rgba(15,17,23,0.95)] border border-[rgba(255,255,255,0.1)] rounded-lg p-3 shadow-lg">
      <p className="text-xs text-[rgba(255,255,255,0.5)] mb-1">{label}</p>
      <p className="text-sm font-medium text-white">
        Response: {data.value !== null ? `${data.value}ms` : 'N/A'}
      </p>
      <p className={cn('text-xs font-medium mt-1', resultColor)}>
        {result}
      </p>
      {data.payload.errorMessage && (
        <p className="text-xs text-red-400 mt-1 max-w-[200px] truncate">
          {data.payload.errorMessage}
        </p>
      )}
    </div>
  );
}

/**
 * HeartbeatChart - Line chart showing heartbeat response times
 *
 * Features:
 * - Response time visualization
 * - Color-coded points (green/red for pass/fail)
 * - Interactive tooltips
 * - Uptime statistics summary
 */
export function HeartbeatChart({
  logs,
  stats,
  period = '7d',
  className,
}: HeartbeatChartProps) {
  // Prepare chart data
  const chartData = useMemo(() => {
    return logs
      .slice()
      .reverse()
      .map((log) => ({
        time: formatTime(log.timestamp, period),
        fullTime: new Date(log.timestamp).toLocaleString(),
        responseTime: log.responseTimeMs,
        result: log.result,
        errorMessage: log.errorMessage,
      }));
  }, [logs, period]);

  // Calculate average for reference line
  const averageResponseTime = stats.averageResponseTimeMs;

  // Color for dots based on result
  const getDotColor = (result: string): string => {
    switch (result) {
      case 'PASS':
        return '#10B981'; // green
      case 'TIMEOUT':
        return '#F59E0B'; // yellow
      case 'FAIL':
        return '#EF4444'; // red
      default:
        return '#6B7280'; // gray
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Activity}
          label="Uptime"
          value={`${stats.percentage.toFixed(1)}%`}
          color={stats.percentage >= 99 ? 'green' : stats.percentage >= 90 ? 'yellow' : 'red'}
        />
        <StatCard
          icon={CheckCircle2}
          label="Successful"
          value={stats.successfulPings.toString()}
          color="green"
        />
        <StatCard
          icon={XCircle}
          label="Failed"
          value={stats.failedPings.toString()}
          color="red"
        />
        <StatCard
          icon={Timer}
          label="Avg Response"
          value={`${stats.averageResponseTimeMs}ms`}
        />
      </div>

      {/* Chart */}
      <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Response Time</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              <span className="text-[rgba(255,255,255,0.5)]">Pass</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="text-[rgba(255,255,255,0.5)]">Timeout</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="text-[rgba(255,255,255,0.5)]">Fail</span>
            </div>
          </div>
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.4)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={averageResponseTime}
                stroke="rgba(59,130,246,0.5)"
                strokeDasharray="5 5"
                label={{
                  value: `Avg: ${averageResponseTime}ms`,
                  fill: 'rgba(59,130,246,0.8)',
                  fontSize: 10,
                  position: 'right',
                }}
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  if (payload.responseTime === null) return <circle cx={cx} cy={0} r={0} />;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={getDotColor(payload.result)}
                      stroke="rgba(0,0,0,0.3)"
                      strokeWidth={1}
                    />
                  );
                }}
                activeDot={{
                  r: 6,
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <Clock className="h-12 w-12 text-[rgba(255,255,255,0.2)] mx-auto mb-3" />
              <p className="text-[rgba(255,255,255,0.5)]">No heartbeat data available</p>
              <p className="text-xs text-[rgba(255,255,255,0.4)] mt-1">
                Data will appear once heartbeat monitoring begins
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Period Info */}
      <p className="text-xs text-[rgba(255,255,255,0.4)] text-center">
        Showing data for the last {period === '24h' ? '24 hours' : period === '7d' ? '7 days' : '30 days'}
      </p>
    </div>
  );
}

/**
 * Stat card component
 */
function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color?: 'green' | 'yellow' | 'red';
}) {
  const colorClasses = {
    green: 'text-green-400 bg-green-500/15',
    yellow: 'text-yellow-400 bg-yellow-500/15',
    red: 'text-red-400 bg-red-500/15',
  };

  return (
    <div className="rounded-lg bg-[rgba(15,17,23,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className={cn(
          'h-8 w-8 rounded-lg flex items-center justify-center',
          color ? colorClasses[color] : 'bg-[rgba(255,255,255,0.05)]'
        )}>
          <Icon className={cn('h-4 w-4', color ? colorClasses[color].split(' ')[0] : 'text-[rgba(255,255,255,0.5)]')} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-[rgba(255,255,255,0.5)]">{label}</p>
    </div>
  );
}
