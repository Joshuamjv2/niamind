import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, MessageCircleQuestion, Users } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CreateQuestionnaireDialog from "@/components/admin/QuestionnaireDialogue";

export default function QuestionnairesView() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");
    const [createOpen, setCreateOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const data = await apiRequest("/api/questionnaires/");
                if (!cancelled) setItems(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) setError(e?.message || "Could not load questionnaires.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    async function handleDelete(item) {
        // TEMP: window.confirm until you add an AlertDialog utility
        const ok = window.confirm(
            `Delete "${item.label}"? This also deletes its questions, sessions, and answers.`
        );
        if (!ok) return;

        setDeletingId(item.id);
        setError(null);
        try {
            await apiRequest(`/api/questionnaires/${item.id}`, { method: "DELETE" });
            setItems((prev) => prev.filter((x) => x.id !== item.id));
        } catch (e) {
            if (e?.status !== 404) {
                setError(e?.message || "Could not delete that questionnaire.");
            } else {
                setItems((prev) => prev.filter((x) => x.id !== item.id));
            }
        } finally {
            setDeletingId(null);
        }
    }

    const q = query.trim().toLowerCase();
    const filtered = q
        ? items.filter(
              (item) =>
                  item.slug?.toLowerCase().includes(q) ||
                  item.label?.toLowerCase().includes(q)
          )
        : items;

    return (
        <div className="space-y-4 mt-4">
            <div className="flex items-start justify-between gap-4">
                <div className="relative max-w-md flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-niamind-muted pointer-events-none" />
                    <Input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by label or slug"
                        className="pl-9 border-niamind-border bg-white focus-visible:ring-niamind-teal/30 focus-visible:border-niamind-teal"
                    />
                </div>
                <Button
                    onClick={() => setCreateOpen(true)}
                    className="bg-niamind-teal text-white hover:bg-niamind-teal/90 shrink-0"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    New
                </Button>
            </div>

            {q && !loading && (
                <p className="text-xs text-niamind-muted">
                    {filtered.length} {filtered.length === 1 ? "match" : "matches"} of {items.length} total
                </p>
            )}

            {error && (
                <p className="text-sm text-niamind-coral" role="alert">{error}</p>
            )}

            {loading && <p className="text-sm text-niamind-muted">Loading…</p>}

            {!loading && items.length === 0 && (
                <div className="bg-white rounded-2xl border border-niamind-border shadow-soft p-10 text-center text-niamind-muted">
                    No questionnaires yet.
                </div>
            )}

            {!loading && items.length > 0 && filtered.length === 0 && (
                <div className="bg-white rounded-2xl border border-niamind-border shadow-soft p-10 text-center text-niamind-muted">
                    No questionnaires match “{query.trim()}”.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((q2) => (
                    <div
                        key={q2.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => navigate(`/admin/questionnaires/${q2.id}`)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                navigate(`/admin/questionnaires/${q2.id}`);
                            }
                        }}
                        className="group cursor-pointer text-left bg-white rounded-2xl border border-niamind-border shadow-soft p-4 hover:border-niamind-teal/40 hover:shadow-card transition flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-niamind-teal/40"
                    >
                        {/* Header: label + slug + badge */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <h3 className="font-semibold text-niamind-text text-lg truncate">
                                    {q2.label}
                                </h3>
                                <p className="text-xs text-niamind-muted mt-0.5 truncate font-mono">
                                    /{q2.slug}
                                </p>
                            </div>
                            <Badge
                                variant={q2.is_active ? "default" : "secondary"}
                                className={q2.is_active ? "bg-niamind-teal text-white" : ""}
                            >
                                {q2.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </div>

                        {/* Stats + actions row (bottom of card) */}
                        <div className="mt-4 flex items-end justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-niamind-muted">
                                <span className="inline-flex items-center rounded-md bg-niamind-gold/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-niamind-gold">
                                    v{q2.version}
                                </span>

                                <span className="inline-flex items-center gap-1" title="Questions">
                                    <MessageCircleQuestion
                                        className="h-3.5 w-3.5 text-niamind-gold"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {typeof q2.question_count === "number"
                                            ? q2.question_count
                                            : "—"}
                                    </span>
                                    <span className="sr-only">questions</span>
                                </span>

                                <span className="inline-flex items-center gap-1" title="Sessions">
                                    <Users
                                        className="h-3.5 w-3.5 text-niamind-teal"
                                        aria-hidden="true"
                                    />
                                    <span>
                                        {typeof q2.session_count === "number"
                                            ? q2.session_count
                                            : "—"}
                                    </span>
                                    <span className="sr-only">sessions</span>
                                </span>

                                <span className="pl-4 text-black/30">{formatDate(q2.created_at)}</span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                                <button
                                    type="button"
                                    aria-label={`Edit ${q2.label}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditTarget(q2);
                                    }}
                                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-niamind-muted hover:text-niamind-text hover:bg-niamind-border/40 transition"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Delete ${q2.label}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(q2);
                                    }}
                                    disabled={deletingId === q2.id}
                                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-niamind-coral hover:bg-niamind-coral/10 transition disabled:opacity-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create dialog */}
            <CreateQuestionnaireDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                onCreated={(created) => {
                    setItems((prev) => [created, ...prev]);
                    navigate(`/admin/questionnaires/${created.id}`);
                }}
            />

            {/* Edit dialog */}
            {editTarget && (
                <CreateQuestionnaireDialog
                    open={Boolean(editTarget)}
                    onOpenChange={(v) => {
                        if (!v) setEditTarget(null);
                    }}
                    initial={editTarget}
                    onCreated={() => {
                        setEditTarget(null);
                        (async () => {
                            try {
                                const data = await apiRequest("/api/questionnaires/");
                                setItems(Array.isArray(data) ? data : []);
                            } catch (_) { /* silent */ }
                        })();
                    }}
                />
            )}
        </div>
    );
}

function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    return Number.isNaN(d.getTime())
        ? String(value)
        : d.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
          });
}
