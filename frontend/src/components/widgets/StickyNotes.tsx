"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, StickyNote, GripVertical } from "lucide-react";

interface Note {
    id: string;
    content: string;
    color: string;
    x: number;
    y: number;
    createdAt: number;
}

const NOTE_COLORS = [
    { bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.2)", text: "#00d4ff" },
    { bg: "rgba(99,102,241,0.08)", border: "rgba(99,102,241,0.2)", text: "#818cf8" },
    { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.2)", text: "#10b981" },
    { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", text: "#f59e0b" },
    { bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", text: "#ef4444" },
];

const STORAGE_KEY = "max-sticky-notes";

export function StickyNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setNotes(JSON.parse(saved));
        } catch { /* ignore */ }
    }, []);

    // Save to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        } catch { /* ignore */ }
    }, [notes]);

    const addNote = useCallback(() => {
        const colorIdx = notes.length % NOTE_COLORS.length;
        const newNote: Note = {
            id: Date.now().toString(),
            content: "",
            color: NOTE_COLORS[colorIdx].text,
            x: 100 + Math.random() * 200,
            y: 100 + Math.random() * 150,
            createdAt: Date.now(),
        };
        setNotes((prev) => [...prev, newNote]);
    }, [notes.length]);

    const updateNote = useCallback((id: string, content: string) => {
        setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, content } : n)));
    }, []);

    const deleteNote = useCallback((id: string) => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const colorIndex = (note: Note) => {
        const idx = NOTE_COLORS.findIndex((c) => c.text === note.color);
        return idx >= 0 ? idx : 0;
    };

    return (
        <>
            {/* Toggle button */}
            <motion.button
                onClick={() => setIsOpen((prev) => !prev)}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer"
                style={{
                    background: isOpen ? "rgba(0,212,255,0.15)" : "rgba(0,212,255,0.05)",
                    border: `1px solid ${isOpen ? "rgba(0,212,255,0.3)" : "rgba(0,212,255,0.12)"}`,
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <StickyNote className="w-3.5 h-3.5 text-[#00d4ff]/60" />
                <span className="text-xs font-mono text-[#94a3b8]">
                    Notes ({notes.length})
                </span>
                {isOpen && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            addNote();
                        }}
                        className="ml-1 w-5 h-5 rounded flex items-center justify-center bg-[rgba(0,212,255,0.15)] text-[#00d4ff] hover:bg-[rgba(0,212,255,0.25)] transition-all cursor-pointer"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                )}
            </motion.button>

            {/* Notes overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 z-30 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {notes.map((note) => {
                            const ci = colorIndex(note);
                            return (
                                <motion.div
                                    key={note.id}
                                    className="absolute pointer-events-auto w-[220px] rounded-xl overflow-hidden"
                                    style={{
                                        left: note.x,
                                        top: note.y,
                                        background: NOTE_COLORS[ci].bg,
                                        border: `1px solid ${NOTE_COLORS[ci].border}`,
                                        backdropFilter: "blur(12px)",
                                        boxShadow: `0 8px 30px rgba(0,0,0,0.3), 0 0 20px ${NOTE_COLORS[ci].text}10`,
                                    }}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    drag
                                    dragMomentum={false}
                                    onDragEnd={(_, info) => {
                                        setNotes((prev) =>
                                            prev.map((n) =>
                                                n.id === note.id
                                                    ? { ...n, x: n.x + info.offset.x, y: n.y + info.offset.y }
                                                    : n
                                            )
                                        );
                                    }}
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: NOTE_COLORS[ci].border }}>
                                        <div className="flex items-center gap-1 cursor-grab active:cursor-grabbing">
                                            <GripVertical className="w-3 h-3 text-[#64748b]/40" />
                                            <span className="text-[9px] font-mono text-[#64748b]">
                                                {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => deleteNote(note.id)}
                                            className="w-5 h-5 rounded flex items-center justify-center text-[#64748b] hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                    {/* Content */}
                                    <textarea
                                        value={note.content}
                                        onChange={(e) => updateNote(note.id, e.target.value)}
                                        placeholder="Type your note..."
                                        className="w-full h-[100px] bg-transparent px-3 py-2 text-sm text-[#e2e8f0] placeholder:text-[#64748b]/40 resize-none focus:outline-none font-mono leading-relaxed"
                                        onPointerDown={(e) => e.stopPropagation()}
                                    />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
