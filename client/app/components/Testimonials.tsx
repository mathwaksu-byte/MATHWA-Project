export default function Testimonials() {
  const items = [
    {
      quote:
        "MATHWA made my admission process effortless. Transparent fees and friendly guidance!",
      name: "Ayan",
    },
    {
      quote:
        "I loved the quick responses and visa support. Highly recommend for medical aspirations.",
      name: "Leena",
    },
    {
      quote:
        "Great university recommendations within my budget. The housing support was a plus.",
      name: "Ravi",
    },
  ];
  return (
    <div className="overflow-x-auto scroll-snap-x mandatory flex gap-4 pb-2">
      {items.map((t, i) => (
        <figure
          key={i}
          className="min-w-[280px] sm:min-w-[360px] scroll-snap-align-start glass rounded-xl p-5"
        >
          <blockquote className="text-sm text-slate-800">“{t.quote}”</blockquote>
          <figcaption className="mt-3 text-xs text-slate-600">— {t.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

