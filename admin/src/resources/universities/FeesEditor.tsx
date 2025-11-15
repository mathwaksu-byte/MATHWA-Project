import { useEffect, useState } from 'react';
import { resolveApiBase } from '../../lib/api';

type Fee = { year: number; tuition: number; hostel: number; misc: number; currency: string };

export default function FeesEditor() {
  const [universities, setUniversities] = useState<Array<{ slug: string; name: string }>>([]);
  const [slug, setSlug] = useState('');
  const [fees, setFees] = useState<Fee[]>([
    { year: 1, tuition: 0, hostel: 0, misc: 0, currency: 'USD' },
    { year: 2, tuition: 0, hostel: 0, misc: 0, currency: 'USD' },
    { year: 3, tuition: 0, hostel: 0, misc: 0, currency: 'USD' },
    { year: 4, tuition: 0, hostel: 0, misc: 0, currency: 'USD' },
    { year: 5, tuition: 0, hostel: 0, misc: 0, currency: 'USD' },
    { year: 6, tuition: 0, hostel: 0, misc: 0, currency: 'USD' },
  ]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [apiBase, setApiBase] = useState<string>('http://localhost:4000');

  useEffect(() => {
    (async () => {
      const base = await resolveApiBase();
      setApiBase(base);
      const r = await fetch(`${base}/api/universities`);
      const j = await r.json();
      const list = (j.universities || []) as Array<any>;
      setUniversities(list.map(u => ({ slug: u.slug, name: u.name })));
      if (list.length > 0) setSlug(list[0].slug);
    })().catch(() => {});
  }, []);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setMessage('');
      try {
        const res = await fetch(`${apiBase}/api/universities/${slug}`).catch(() => null as any);
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        const loaded: Fee[] = Array.isArray(json.fees) ? json.fees : [];
        if (loaded.length > 0) {
          loaded.sort((a, b) => a.year - b.year);
          setFees(loaded.map(f => ({ ...f, currency: f.currency || 'USD' })) as Fee[]);
          setMessage('Loaded saved fees');
        }
      } catch {
        // keep defaults
      }
    })();
  }, [slug]);

  const updateFee = (idx: number, key: keyof Fee, val: string) => {
    const next = fees.slice();
    if (key === 'currency') (next[idx] as any)[key] = val;
    else (next[idx] as any)[key] = Number(val);
    setFees(next);
  };

  const addYear = () => {
    const year = (fees[fees.length - 1]?.year || 0) + 1;
    const currency = fees[fees.length - 1]?.currency || 'USD';
    setFees([...fees, { year, tuition: 0, hostel: 0, misc: 0, currency }]);
  };

  const deleteYear = async (year: number) => {
    if (!slug) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBase}/api/universities/${slug}/fees`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year }),
      }).catch(() => null as any);
      if (!res || !res.ok) throw new Error('Failed');
      const json = await res.json();
      const loaded: Fee[] = Array.isArray(json.fees) ? json.fees : [];
      loaded.sort((a, b) => a.year - b.year);
      setFees(loaded.map(f => ({ ...f, currency: f.currency || 'USD' })) as Fee[]);
      setMessage('Deleted year');
    } catch (e) {
      setMessage('Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const clearAll = async () => {
    if (!slug) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBase}/api/universities/${slug}/fees`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      }).catch(() => null as any);
      if (!res || !res.ok) throw new Error('Failed');
      setFees([]);
      setMessage('Cleared all fees');
    } catch (e) {
      setMessage('Failed to clear');
    } finally {
      setSaving(false);
    }
  };
  const save = async () => {
    if (!slug) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch(`${apiBase}/api/universities/${slug}/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fees, replace: true }),
      }).catch(() => null as any);
      if (!res.ok) throw new Error('Failed');
      setMessage('Fees saved');
    } catch (e) {
      setMessage('Failed to save fees');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">University Fees</h2>
      <div className="mt-4 flex gap-2 items-center">
        <label>University</label>
        <select value={slug} onChange={e => setSlug(e.target.value)} className="border px-2 py-1 rounded">
          {universities.map(u => (
            <option key={u.slug} value={u.slug}>{u.name}</option>
          ))}
        </select>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left">Year</th>
              <th className="px-2 py-1 text-left">Tuition</th>
              <th className="px-2 py-1 text-left">Hostel</th>
              <th className="px-2 py-1 text-left">Misc</th>
              <th className="px-2 py-1 text-left">Currency</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((f, idx) => (
              <tr key={idx}>
                <td className="px-2 py-1 flex items-center gap-2">
                  <span>{f.year}</span>
                  <button type="button" onClick={() => deleteYear(f.year)} className="px-2 py-0.5 text-xs rounded bg-red-600 text-white">Delete</button>
                </td>
                <td className="px-2 py-1"><input type="number" value={f.tuition} onChange={e => updateFee(idx, 'tuition', e.target.value)} className="border px-2 py-1 rounded w-24" /></td>
                <td className="px-2 py-1"><input type="number" value={f.hostel} onChange={e => updateFee(idx, 'hostel', e.target.value)} className="border px-2 py-1 rounded w-24" /></td>
                <td className="px-2 py-1"><input type="number" value={f.misc} onChange={e => updateFee(idx, 'misc', e.target.value)} className="border px-2 py-1 rounded w-24" /></td>
                <td className="px-2 py-1"><input value={f.currency} onChange={e => updateFee(idx, 'currency', e.target.value)} className="border px-2 py-1 rounded w-24" /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addYear} className="mt-3 px-3 py-1 rounded bg-slate-100">Add Year</button>
      </div>
      <div className="mt-6">
        <button onClick={save} disabled={saving} className="px-4 py-2 rounded bg-blue-600 text-white">{saving ? 'Saving…' : 'Save Fees'}</button>
        <button onClick={clearAll} disabled={saving} className="ml-3 px-4 py-2 rounded bg-red-600 text-white">Clear All</button>
        {message && <span className="ml-3 text-sm">{message}</span>}
      </div>
    </div>
  );
}
