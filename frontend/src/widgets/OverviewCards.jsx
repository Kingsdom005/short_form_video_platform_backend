export default function OverviewCards({ overview }) {
  const cards = [
    { title: 'Total Messages', value: overview?.totalMessages ?? 0 },
    { title: 'Total Leads', value: overview?.totalLeads ?? 0 },
    { title: 'Risk Cases', value: overview?.totalRisks ?? 0 },
    { title: 'Approx Room QPS', value: overview?.roomQpsApprox ?? 0 }
  ];

  return (
    <div className="card-grid">
      {cards.map(card => (
        <div className="card" key={card.title}>
          <p className="card-label">{card.title}</p>
          <h3>{card.value}</h3>
        </div>
      ))}
    </div>
  );
}
