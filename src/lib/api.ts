import { DocumentApproval } from "../components/types"

const isLocalhost = window.location.hostname === "localhost"

export const API_BASE = isLocalhost
  ? "http://localhost:3000"
  : "https://btp-document-approval-engine.up.railway.app"

export const api = {
  getDocuments: () => fetch(`${API_BASE}/documents`).then((res) => res.json()),
  createDocument: (document: DocumentApproval) =>
    fetch(`${API_BASE}/documents`, {
      method: "POST",
      body: JSON.stringify(document),
      headers: { "Content-Type": "application/json" },
    }),
  submitDocument: async (id: number): Promise<DocumentApproval> => {
    const response = await fetch(`${API_BASE}/documents/${id}/submit`, {
      method: "POST",
    })

    if (!response.ok) throw new Error("Error en el submit")

    return response.json()
  },
}
