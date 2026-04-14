export default function MessageTable({ messages }) {
  return (
    <div className="panel">
      <h3>Recent Messages</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Event ID</th>
            <th>Nickname</th>
            <th>Message</th>
            <th>Intent</th>
            <th>Risk</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {messages.map(item => (
            <tr key={item.event_id}>
              <td>{item.event_id}</td>
              <td>{item.nickname}</td>
              <td>{item.message_text}</td>
              <td>{item.intent || '-'}</td>
              <td>{item.risk_level}</td>
              <td>{item.process_status}</td>
              <td>{new Date(item.created_at).toLocaleString()}</td>
            </tr>
          ))}
          {!messages.length && (
            <tr>
              <td colSpan="7">No messages yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
