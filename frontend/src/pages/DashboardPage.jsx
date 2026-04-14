import { useEffect, useState } from 'react';
import { useDashboardStore } from '../store/useDashboardStore';
import OverviewCards from '../widgets/OverviewCards';
import QueueChart from '../widgets/QueueChart';
import MessageTable from '../widgets/MessageTable';
import client from '../api/client';

// Simple chart component for data visualization
const Chart = ({ title, data, xKey, yKey, color }) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '20px' }}>No data available</div>;
  }

  const maxValue = Math.max(...data.map(item => item[yKey] || 0));
  const barWidth = 30;
  const chartHeight = 300;

  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ marginBottom: '16px' }}>{title}</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', height: chartHeight, gap: '10px', overflowX: 'auto' }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
              style={{
                width: barWidth,
                height: item[yKey] ? (item[yKey] / maxValue) * chartHeight : 0,
                backgroundColor: color,
                marginBottom: '8px'
              }}
            />
            <div style={{ fontSize: '12px', textAlign: 'center' }}>
              {item[xKey].split('-').slice(1).join('/')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { overview, messages, fetchAll, loading } = useDashboardStore();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    fetchAll();
    fetchStats();
    const timer = setInterval(() => {
      fetchAll();
      fetchStats();
    }, 5000);
    return () => clearInterval(timer);
  }, [fetchAll]);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await client.get('/stats/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Live Operations Dashboard</h2>
        <button onClick={() => {
          fetchAll();
          fetchStats();
        }}>
          {loading || statsLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <OverviewCards overview={overview} />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div className="panel">
          <h3>User Growth</h3>
          {statsLoading ? (
            <div>Loading...</div>
          ) : (
            <Chart 
              title="User Growth (Last 7 Days)" 
              data={stats?.userGrowth || []} 
              xKey="date" 
              yKey="count" 
              color="#1890ff" 
            />
          )}
        </div>
        <div className="panel">
          <h3>Video Growth</h3>
          {statsLoading ? (
            <div>Loading...</div>
          ) : (
            <Chart 
              title="Video Growth (Last 7 Days)" 
              data={stats?.videoGrowth || []} 
              xKey="date" 
              yKey="count" 
              color="#52c41a" 
            />
          )}
        </div>
      </div>

      <div className="panel" style={{ marginBottom: '30px' }}>
        <h3>Watch Time</h3>
        {statsLoading ? (
          <div>Loading...</div>
        ) : (
          <Chart 
            title="Watch Time (Last 7 Days)" 
            data={stats?.watchTime || []} 
            xKey="date" 
            yKey="total" 
            color="#faad14" 
          />
        )}
      </div>

      <QueueChart overview={overview} />
      <MessageTable messages={messages} />
    </div>
  );
}
