import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function QueueChart({ overview }) {
  const data = [
    { name: 'Messages', value: overview?.totalMessages ?? 0 },
    { name: 'Leads', value: overview?.totalLeads ?? 0 },
    { name: 'Risks', value: overview?.totalRisks ?? 0 },
    { name: 'QPS', value: overview?.roomQpsApprox ?? 0 }
  ];

  return (
    <div className="panel">
      <h3>Business Metrics</h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
