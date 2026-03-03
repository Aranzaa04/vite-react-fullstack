import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
import { useAuth } from "../context/AuthContext";
import { notesService, type Note } from "../services/notesService";

const noteColors = ["#fce7f3", "#fde68a", "#dbeafe", "#dcfce7", "#e9d5ff"];

const pageStyle: React.CSSProperties = {
  minHeight: "100%",
  background: "#ffffff",
  padding: 0,
};

const layoutStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 20,
  alignItems: "start",
};

const panelStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 18,
  padding: 22,
  color: "#0b1320",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
};

const linkStyle: React.CSSProperties = {
  display: "block",
  padding: "10px 12px",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.08)",
  background: "#f8fafc",
  color: "#0b1320",
  textDecoration: "none",
  marginBottom: 10,
};

const noteInputStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 120,
  resize: "vertical",
  borderRadius: 12,
  border: "1px solid rgba(0,0,0,0.12)",
  padding: 12,
  font: "inherit",
  boxSizing: "border-box",
  outline: "none",
  background: "#ffffff",
  color: "#0b1320",
};

const actionButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: 10,
  padding: "10px 14px",
  fontWeight: 700,
  cursor: "pointer",
};

export default function Home() {
  const { token, usuario } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [selectedColor, setSelectedColor] = useState(noteColors[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  useEffect(() => {
    if (!token) {
      setNotes([]);
      setIsLoadingNotes(false);
      return;
    }

    const loadNotes = async () => {
      try {
        setIsLoadingNotes(true);
        setNotesError(null);
        const fetchedNotes = await notesService.getAll(token);
        setNotes(fetchedNotes);
      } catch (error) {
        const message = error instanceof Error ? error.message : "No se pudieron cargar las notas";
        setNotesError(message);
      } finally {
        setIsLoadingNotes(false);
      }
    };

    void loadNotes();
  }, [token]);

  const resetForm = () => {
    setDraft("");
    setSelectedColor(noteColors[0]);
    setEditingId(null);
  };

  const handleSaveNote = async () => {
    if (!token) {
      setNotesError("No hay una sesión activa para guardar notas");
      return;
    }

    const text = draft.trim();
    if (!text) {
      return;
    }

    try {
      setIsSaving(true);
      setNotesError(null);

      if (editingId) {
        const updatedNote = await notesService.update(token, editingId, {
          text,
          color: selectedColor,
        });

        setNotes((currentNotes) =>
          currentNotes.map((note) => (note.id === editingId ? updatedNote : note)),
        );
        resetForm();
        return;
      }

      const createdNote = await notesService.create(token, {
        text,
        color: selectedColor,
      });

      setNotes((currentNotes) => [createdNote, ...currentNotes]);
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo guardar la nota";
      setNotesError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setDraft(note.text);
    setSelectedColor(note.color);
    setEditingId(note.id);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!token) {
      setNotesError("No hay una sesión activa para eliminar notas");
      return;
    }

    try {
      setIsSaving(true);
      setNotesError(null);
      await notesService.remove(token, noteId);
      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
      if (editingId === noteId) {
        resetForm();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudo eliminar la nota";
      setNotesError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={layoutStyle}>
        <section style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>Panel de datos</h2>
          <p style={{ color: "rgba(11,19,32,0.7)", marginTop: 6 }}>
            Vistas en tabla para que se entiendan mejor tus datos.
          </p>

          <Link to="/inventario" style={linkStyle}>Ver Inventario (tabla)</Link>
          <Link to="/compra" style={linkStyle}>Ver Compra (tabla)</Link>
          <Link to="/usuarios" style={linkStyle}>Ver Usuarios (tabla)</Link>
          <Link to="/ventas" style={linkStyle}>Ver Venta (tabla)</Link>
          <Link to="/proveedores" style={linkStyle}>Ver Proveedores (tabla)</Link>

          <div style={{ marginTop: 14, fontSize: 13, color: "rgba(11,19,32,0.65)" }}>
            API base: <code>{API_URL || "(no definido)"}</code>
          </div>
        </section>

        <section style={panelStyle}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <h2 style={{ margin: 0 }}>Notas</h2>
              <p style={{ margin: "6px 0 0", color: "rgba(11,19,32,0.7)" }}>
                Agrega, edita y elimina notas rapidas del dashboard.
              </p>
            </div>
            <span
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                background: "#f8fafc",
                border: "1px solid rgba(0,0,0,0.08)",
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {notes.length} nota{notes.length === 1 ? "" : "s"}
            </span>
          </div>

          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Escribe una nota..."
            style={noteInputStyle}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 12, marginBottom: 12, flexWrap: "wrap" }}>
            {noteColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setSelectedColor(color)}
                aria-label={`Seleccionar color ${color}`}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  border: selectedColor === color ? "2px solid #0b1320" : "1px solid rgba(0,0,0,0.12)",
                  background: color,
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => void handleSaveNote()}
              disabled={isSaving || !token}
              style={{ ...actionButtonStyle, background: "#0f172a", color: "#ffffff" }}
            >
              {isSaving ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar nota"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                style={{
                  ...actionButtonStyle,
                  background: "#ffffff",
                  color: "#0b1320",
                  border: "1px solid rgba(0,0,0,0.12)",
                }}
              >
                Cancelar
              </button>
            ) : null}
          </div>

          {notesError ? (
            <div
              style={{
                borderRadius: 12,
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                padding: "10px 12px",
                marginBottom: 18,
              }}
            >
              {notesError}
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 12 }}>
            {isLoadingNotes ? (
              <div
                style={{
                  borderRadius: 14,
                  border: "1px dashed rgba(0,0,0,0.14)",
                  padding: 18,
                  color: "rgba(11,19,32,0.6)",
                }}
              >
                Cargando notas...
              </div>
            ) : notes.length === 0 ? (
              <div
                style={{
                  borderRadius: 14,
                  border: "1px dashed rgba(0,0,0,0.14)",
                  padding: 18,
                  color: "rgba(11,19,32,0.6)",
                }}
              >
                Aun no tienes notas. Crea la primera en el panel superior.
              </div>
            ) : (
              notes.map((note) => (
                <article
                  key={note.id}
                  style={{
                    borderRadius: 14,
                    padding: 16,
                    background: note.color,
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  <p style={{ margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{note.text}</p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 14,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontSize: 12, color: "rgba(11,19,32,0.65)", fontWeight: 700 }}>
                      {note.user_id === usuario?.id ? "Tu nota" : "Nota compartida"}
                    </span>
                    {note.user_id === usuario?.id ? (
                      <div style={{ display: "flex", gap: 10 }}>
                        <button
                          type="button"
                          onClick={() => handleEditNote(note)}
                          style={{ ...actionButtonStyle, background: "rgba(255,255,255,0.7)", color: "#0b1320" }}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteNote(note.id)}
                          disabled={isSaving}
                          style={{ ...actionButtonStyle, background: "rgba(11,19,32,0.9)", color: "#ffffff" }}
                        >
                          Eliminar
                        </button>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
