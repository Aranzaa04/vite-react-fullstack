import { api } from "./apiClient";

export type Note = {
  id: string;
  user_id: number;
  text: string;
  color: string;
};

type NotePayload = {
  text: string;
  color: string;
};

function getAuthHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export const notesService = {
  async getAll(token: string): Promise<Note[]> {
    return api<Note[]>("/notas", {
      headers: getAuthHeaders(token),
    });
  },

  async create(token: string, payload: NotePayload): Promise<Note> {
    return api<Note>("/notas", {
      method: "POST",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  async update(token: string, noteId: string, payload: NotePayload): Promise<Note> {
    return api<Note>(`/notas/${noteId}`, {
      method: "PUT",
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
  },

  async remove(token: string, noteId: string): Promise<{ id: string }> {
    return api<{ id: string }>(`/notas/${noteId}`, {
      method: "DELETE",
      headers: getAuthHeaders(token),
    });
  },
};
