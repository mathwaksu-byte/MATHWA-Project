import type { DataProvider, RaRecord } from 'react-admin';

// Default to the local server port used in this repo (4000). Allow override via VITE_SERVER_BASE_URL.
const apiBase = (import.meta.env.VITE_SERVER_BASE_URL as string) || 'http://localhost:4000';
const fallbackBase = apiBase === 'http://localhost:4000' ? 'http://localhost:4001' : 'http://localhost:4000';

const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    if (resource === 'universities') {
      let res = await fetch(`${apiBase}/api/universities`).catch(() => null as any);
      if (!res || !res.ok) res = await fetch(`${fallbackBase}/api/universities`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      const data: RaRecord[] = (json.universities || []).map((u: any) => ({ ...u, id: u.slug || u.id }));
      return { data, total: data.length };
    }
    if (resource === 'leads') {
      const { page, perPage } = (params as any).pagination || { page: 1, perPage: 20 };
      const f = (params as any).filter || {};
      const qs = new URLSearchParams();
      qs.set('page', String(page));
      qs.set('perPage', String(perPage));
      if (f.q) qs.set('q', String(f.q));
      if (f.status) qs.set('status', String(f.status));
      if (f.preferred_university_slug) qs.set('university', String(f.preferred_university_slug));
      if (f.assigned_admin_id) qs.set('assigned', String(f.assigned_admin_id));
      const res = await fetch(`${apiBase}/api/admin/leads?${qs.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const json = await res.json();
      const data: RaRecord[] = (json.data || []).map((u: any) => ({ ...u, id: u.id }));
      const total = json.total || data.length;
      return { data, total };
    }
    throw new Error('Resource not supported');
  },
  getOne: async (resource, params) => {
    if (resource === 'universities') {
      const id = (params as any).id as string;
      let res = await fetch(`${apiBase}/api/universities/${id}`).catch(() => null as any);
      if (!res || !res.ok) res = await fetch(`${fallbackBase}/api/universities/${id}`);
      if (!res.ok) throw new Error('Not found');
      const json = await res.json();
      const u = json.university;
      return { data: { ...u, id: u.slug || u.id } };
    }
    if (resource === 'leads') {
      const id = (params as any).id as string;
      const res = await fetch(`${apiBase}/api/admin/leads/${id}`);
      if (!res.ok) throw new Error('Not found');
      const json = await res.json();
      const u = json.data;
      return { data: { ...u, id: u.id } };
    }
    throw new Error('Resource not supported');
  },
  create: async (resource, params) => {
    if (resource === 'universities') {
      const body = JSON.stringify((params as any).data);
      let res = await fetch(`${apiBase}/api/universities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).catch(() => null as any);
      if (!res || !res.ok) res = await fetch(`${fallbackBase}/api/universities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
      if (!res.ok) throw new Error('Failed to create');
      const json = await res.json();
      const u = json.university;
      return { data: { ...u, id: u.slug || u.id } };
    }
    throw new Error('Not implemented in demo mode');
  },
  update: async (resource, params) => {
    if (resource === 'leads') {
      const id = (params as any).id as string;
      const res = await fetch(`${apiBase}/api/admin/leads/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify((params as any).data) });
      if (!res.ok) throw new Error('Failed to update');
      const json = await res.json();
      const u = json.data;
      return { data: { ...u, id: u.id } };
    }
    if (resource === 'universities') {
      const id = (params as any).id as string;
      const body = JSON.stringify((params as any).data);
      let res = await fetch(`${apiBase}/api/universities/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body }).catch(() => null as any);
      if (!res || !res.ok) res = await fetch(`${fallbackBase}/api/universities/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body });
      if (!res.ok) throw new Error('Failed to update');
      const json = await res.json();
      const u = json.university;
      return { data: { ...u, id: u.slug || u.id } };
    }
    throw new Error('Not implemented in demo mode');
  },
  delete: async (resource, params) => {
    if (resource === 'universities') {
      const id = (params as any).id as string;
      let res = await fetch(`${apiBase}/api/universities/${id}`, { method: 'DELETE' }).catch(() => null as any);
      if (!res || !res.ok) res = await fetch(`${fallbackBase}/api/universities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      return { data: { id } };
    }
    throw new Error('Not implemented in demo mode');
  },
  getMany: async () => ({ data: [] }),
  getManyReference: async () => ({ data: [], total: 0 }),
  updateMany: async () => ({ data: [] }),
  deleteMany: async () => ({ data: [] }),
};

export default dataProvider;
