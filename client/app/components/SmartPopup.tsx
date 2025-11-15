import { useEffect, useState } from 'react';

export default function SmartPopup() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 15000);
    const onScroll = () => {
      if (window.scrollY > 600) setVisible(true);
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 right-6 glass p-4 rounded-lg shadow-glow">
      <div className="font-semibold">Official Admissions Desk</div>
      <p className="text-sm text-slate-700 mt-1">Chat with the official admissions team representing I. Arabaev KSU.</p>
      <div className="mt-3 flex gap-2">
        <a href="https://wa.me/" className="px-3 py-2 rounded-md bg-green-600 text-white">WhatsApp</a>
        <a href="/apply" className="px-3 py-2 rounded-md bg-royalBlue text-white">Apply (Official)</a>
      </div>
      <button className="absolute -top-2 -right-2 bg-slate-800 text-white rounded-full w-6 h-6" onClick={() => setVisible(false)}>×</button>
    </div>
  );
}
