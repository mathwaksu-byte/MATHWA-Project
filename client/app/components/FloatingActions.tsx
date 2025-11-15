export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col gap-3">
      <a title="WhatsApp" href="https://wa.me/" className="w-12 h-12 rounded-full bg-green-600 text-white grid place-items-center shadow-glow">WA</a>
      <a title="Call" href="tel:+919999999999" className="w-12 h-12 rounded-full bg-golden text-black grid place-items-center shadow-glow">📞</a>
    </div>
  );
}

