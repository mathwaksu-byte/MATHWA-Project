import { useState } from "react";

const faqs = [
  {
    q: "Is MBBS abroad affordable?",
    a: "Yes. We curate universities with transparent fee structures and scholarships to fit various budgets.",
  },
  {
    q: "Do you help with visa and housing?",
    a: "Absolutely. We assist with visa paperwork and help secure student housing near campus.",
  },
  {
    q: "How long does admission take?",
    a: "With complete documents, offers often arrive within 2–3 weeks, varying by university.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3" role="list" aria-label="Frequently asked questions">
      {faqs.map((item, idx) => {
        const isOpen = open === idx;
        const buttonId = `faq-button-${idx}`;
        const panelId = `faq-panel-${idx}`;
        return (
          <div key={idx} className="glass rounded-xl" role="listitem">
            <button
              id={buttonId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : idx)}
              className="w-full text-left px-4 py-3 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-royalBlue rounded-xl"
            >
              <span className="font-medium text-slate-800">{item.q}</span>
              <span className="text-slate-500" aria-hidden="true">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={buttonId} className="px-4 pb-4 text-sm text-slate-700">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
