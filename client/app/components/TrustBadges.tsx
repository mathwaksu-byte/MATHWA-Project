export default function TrustBadges() {
  const items = [
    { label: "Transparent Fees", icon: "💳" },
    { label: "Top Accreditation", icon: "🏛️" },
    { label: "Visa Support", icon: "🛂" },
    { label: "Student Housing", icon: "🏡" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {items.map((b) => (
        <div key={b.label} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">{b.icon}</span>
          <span className="text-sm font-medium text-slate-800">{b.label}</span>
        </div>
      ))}
    </div>
  );
}

