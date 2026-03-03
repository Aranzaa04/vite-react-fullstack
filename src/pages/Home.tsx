import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";

type Note = {
  id: string;
  text: string;
  color: string;
};

const NOTE_STORAGE_KEY = "dashboard-notes";
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
  const [notes, setNotes] = useState<Note[]>([]);
  const [draft, setDraft] = useState("");
  const [selectedColor, setSelectedColor] = useState(noteColors[0]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const savedNotes = window.localStorage.getItem(NOTE_STORAGE_KEY);
    if (!savedNotes) {
      return;
    }

    try {
      const parsedNotes = JSON.parse(savedNotes) as Note[];
      if (Array.isArray(parsedNotes)) {
        setNotes(parsedNotes);
      }
    } catch {
      window.localStorage.removeItem(NOTE_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(NOTE_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const resetForm = () => {
    setDraft("");
    setSelectedColor(noteColors[0]);
    setEditingId(null);
  };

  const handleSaveNote = () => {
    const text = draft.trim();
    if (!text) {
      return;
    }

    if (editingId) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId ? { ...note, text, color: selectedColor } : note,
        ),
      );
      resetForm();
      return;
    }

    setNotes((currentNotes) => [
      {
        id: crypto.randomUUID(),
        text,
        color: selectedColor,
      },
      ...currentNotes,
    ]);
    resetForm();
  };

  const handleEditNote = (note: Note) => {
    setDraft(note.text);
    setSelectedColor(note.color);
    setEditingId(note.id);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== noteId));
    if (editingId === noteId) {
      resetForm();
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
              onClick={handleSaveNote}
              style={{ ...actionButtonStyle, background: "#0f172a", color: "#ffffff" }}
            >
              {editingId ? "Guardar cambios" : "Agregar nota"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
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

          <div style={{ display: "grid", gap: 12 }}>
            {notes.length === 0 ? (
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
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button
                      type="button"
                      onClick={() => handleEditNote(note)}
                      style={{ ...actionButtonStyle, background: "rgba(255,255,255,0.7)", color: "#0b1320" }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note.id)}
                      style={{ ...actionButtonStyle, background: "rgba(11,19,32,0.9)", color: "#ffffff" }}
                    >
                      Eliminar
                    </button>
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
