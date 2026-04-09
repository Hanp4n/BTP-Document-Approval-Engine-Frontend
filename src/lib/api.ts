const API_BASE = "https://btp-document-approval-engine.up.railway.app";

export const api = {
  getDocuments: () => fetch(`${API_BASE}/documents`).then(res => res.json()),
  submitDocument: (id: number) => fetch(`${API_BASE}/documents/${id}/submit`, { method: 'POST' }),
};