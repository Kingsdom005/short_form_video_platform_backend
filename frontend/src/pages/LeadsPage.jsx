import { useEffect } from 'react';
import { useDashboardStore } from '../store/useDashboardStore';

export default function LeadsPage() {
  const { leads, fetchAll } = useDashboardStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div>
      <div className="page-header">
        <h2>Lead Workbench</h2>
      </div>
      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Lead No</th>
              <th>User</th>
              <th>Status</th>
              <th>Score</th>
              <th>Intent</th>
              <th>Agent</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(item => (
              <tr key={item.lead_no}>
                <td>{item.lead_no}</td>
                <td>{item.user_open_id}</td>
                <td>{item.lead_status}</td>
                <td>{item.lead_score}</td>
                <td>{item.intent}</td>
                <td>{item.assigned_agent}</td>
                <td>{new Date(item.updated_at).toLocaleString()}</td>
              </tr>
            ))}
            {!leads.length && (
              <tr>
                <td colSpan="7">No leads yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
