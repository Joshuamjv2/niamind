import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
    ArrowLeft, ChevronDown, ChevronRight, Plus, Pencil, Trash2, Loader2,
    MessageCircleQuestion, Users, Info,
} from "lucide-react";
import { apiRequest } from "@/utils/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const QUESTION_TYPES = [
    { value: "text", label: "Text" },
    { value: "single_select", label: "Single choice" },
    { value: "multiselect", label: "Multiple choice" },
];

function typeLabel(value) {
    return QUESTION_TYPES.find((t) => t.value === value)?.label ?? value;
}

function slugify(value) {
    return (value || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[‘’']/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function deriveKey(text, existing) {
    const base = slugify(text) || "question";
    let key = base;
    let n = 2;
    while (existing.has(key)) key = `${base}_${n++}`;
    return key;
}

function parseOptions(text) {
    return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

export default function QuestionnaireDetail() {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notice, setNotice] = useState(null);
    const [tab, setTab] = useState("questions");                // ← controlled tabs
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorTarget, setEditorTarget] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    async function reload() {
        try {
            const res = await apiRequest(`/api/questionnaires/${id}`);
            setData(res);
        } catch (e) {
            setError(e?.message || "Could not load this questionnaire.");
        }
    }

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await apiRequest(`/api/questionnaires/${id}`);
                if (!cancelled) setData(res);
            } catch (e) {
                if (!cancelled) setError(e?.message || "Could not load this questionnaire.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, [id]);

    async function handleDelete(question) {
        const ok = window.confirm(`Delete "${question.text}"?`);
        if (!ok) return;

        setDeletingId(question.id);
        setNotice(null);
        setError(null);
        try {
            const result = await apiRequest(`/api/questions/${question.id}`, { method: "DELETE" });
            if (result?.action === "retired") {
                setNotice("This question has responses, so it was retired instead of deleted. It no longer appears on the form.");
            }
            await reload();
        } catch (e) {
            if (e?.status !== 404) {
                setError(e?.message || "Could not delete that question.");
            } else {
                await reload();
            }
        } finally {
            setDeletingId(null);
        }
    }

    function openAdd() {
        setEditorTarget(null);
        setEditorOpen(true);
    }

    function openEdit(question) {
        setEditorTarget(question);
        setEditorOpen(true);
    }

    const activeQuestions = useMemo(() => {
        const qs = (data?.questions ?? []).filter((q) => q.is_active !== false);
        return [...qs].sort((a, b) => a.order - b.order);
    }, [data]);

    if (loading) return <p className="text-sm text-niamind-muted">Loading…</p>;
    if (error)
        return (
            <p className="text-sm text-niamind-coral" role="alert">{error}</p>
        );
    if (!data) return null;

    const nextOrder = activeQuestions.length
        ? Math.max(...activeQuestions.map((q) => q.order)) + 1
        : 0;

    return (
        <div className="space-y-6">
            <Link to="/admin/questionnaires" className="inline-flex items-center gap-1.5 text-sm text-niamind-muted hover:text-niamind-text transition">
                <ArrowLeft className="h-4 w-4" />
                All questionnaires
            </Link>

            <div className="bg-white rounded-2xl border border-niamind-border shadow-soft p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                        <h2 className="ff-serif text-2xl text-niamind-text truncate">{data.label}</h2>
                        <p className="text-sm text-niamind-muted mt-0.5 font-mono">/{data.slug}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <Badge variant={data.is_active ? "default" : "secondary"} className={data.is_active ? "bg-niamind-teal text-white" : ""}>
                            {data.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <span className="inline-flex items-center rounded-md bg-niamind-gold/10 px-2 py-0.5 font-mono text-xs font-semibold text-niamind-gold">
                            v{data.version}
                        </span>
                    </div>
                </div>
            </div>

            {notice && (
                <div className="rounded-xl border border-niamind-gold/30 bg-niamind-gold/5 p-3 text-sm text-niamind-text flex items-start gap-2">
                    <Info className="h-4 w-4 text-niamind-gold shrink-0 mt-0.5" />
                    <span>{notice}</span>
                </div>
            )}

            <Tabs value={tab} onValueChange={setTab}>
                {/* TabsList + Add button share one row */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <TabsList>
                        <TabsTrigger value="questions" className="gap-1.5">
                            <MessageCircleQuestion className="h-3.5 w-3.5" />
                            Questions <span className="px-1">{activeQuestions.length}</span>
                        </TabsTrigger>
                        <TabsTrigger value="sessions" className="gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            Sessions <span className="px-1">{data.sessions?.length ?? 0}</span>
                        </TabsTrigger>
                    </TabsList>

                    {tab === "questions" && (
                        <Button onClick={openAdd} size="sm" className="bg-niamind-teal text-white hover:bg-niamind-teal/90 shrink-0">
                            <Plus className="h-4 w-4 mr-1.5" />
                            Add question
                        </Button>
                    )}
                </div>

                <TabsContent value="questions" className="mt-4">
                    <QuestionsTab questions={activeQuestions} sessions={data.sessions ?? []} onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete} deletingId={deletingId} />
                </TabsContent>

                <TabsContent value="sessions" className="mt-4">
                    <SessionsTab questions={activeQuestions} sessions={data.sessions ?? []} />
                </TabsContent>
            </Tabs>

            <QuestionEditorDialog
                open={editorOpen}
                onOpenChange={setEditorOpen}
                questionnaireId={id}
                initial={editorTarget}
                nextOrder={nextOrder}
                existingKeys={new Set(activeQuestions.map((q) => q.key))}
                onSaved={async () => {
                    setEditorOpen(false);
                    await reload();
                }}
            />
        </div>
    );
}

/* ---------------- Questions tab ---------------- */

function QuestionsTab({ questions, sessions, onAdd, onEdit, onDelete, deletingId }) {
    if (questions.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-dashed border-niamind-border p-10 text-center space-y-3">
                <MessageCircleQuestion className="h-8 w-8 mx-auto text-niamind-muted/60" />
                <p className="text-sm text-niamind-muted">No questions yet.</p>
                <Button
                    onClick={onAdd}
                    className="bg-niamind-teal text-white hover:bg-niamind-teal/90"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add the first question
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {questions.map((q) => (
                <QuestionRow
                    key={q.id}
                    question={q}
                    sessions={sessions}
                    onEdit={() => onEdit(q)}
                    onDelete={() => onDelete(q)}
                    isDeleting={deletingId === q.id}
                />
            ))}
        </div>
    );
}

function QuestionRow({ question, sessions, onEdit, onDelete, isDeleting }) {
    const [open, setOpen] = useState(false);

    const answers = useMemo(() => {
        const list = [];
        for (const s of sessions) {
            const a = s.answers?.find((x) => x.question_id === question.id);
            list.push({
                sessionId: s.id,
                participant: participantLabel(s),
                value: formatAnswer(a),
                answeredAt: a?.created_at ?? null,
            });
        }
        return list;
    }, [question.id, sessions]);

    return (
        <div className="bg-white rounded-2xl border border-niamind-border shadow-soft overflow-hidden">
            <div className="flex items-start gap-3 p-4">
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="flex-1 flex items-start gap-3 text-left min-w-0"
                >
                    <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-md bg-niamind-teal/10 text-xs font-mono font-semibold text-niamind-teal shrink-0">
                        #{question.order + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-niamind-text">{question.text}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            <Badge variant="secondary" className="text-[10px]">
                                {typeLabel(question.type)}
                            </Badge>
                            {question.required && (
                                <Badge className="text-[10px] bg-niamind-gold/15 text-niamind-gold hover:bg-niamind-gold/15">
                                    Required
                                </Badge>
                            )}
                            <span className="text-xs text-niamind-muted font-mono">
                                {question.key}
                            </span>
                        </div>
                    </div>
                </button>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={onEdit}
                        aria-label="Edit question"
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-niamind-muted hover:text-niamind-gold hover:bg-niamind-gold/10 transition"
                    >
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={isDeleting}
                        aria-label="Delete question"
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-niamind-coral hover:bg-niamind-coral/10 transition disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-label={open ? "Hide answers" : "Show answers"}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-niamind-muted hover:bg-niamind-border/40 transition"
                    >
                        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {open && (
                <div className="border-t border-niamind-border bg-niamind-bg/30">
                    {answers.length === 0 ? (
                        <p className="p-4 text-sm text-niamind-muted">No answers yet.</p>
                    ) : (
                        <ul className="divide-y divide-niamind-border">
                            {answers.map((a, i) => (
                                <li key={i} className="p-3 flex items-start justify-between gap-4 text-sm">
                                    <p className="text-niamind-text min-w-0">{a.value}</p>
                                    <span className="text-xs text-niamind-muted shrink-0">{a.participant}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

/* ---------------- Sessions tab ---------------- */

function SessionsTab({ questions, sessions }) {
    if (sessions.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-dashed border-niamind-border p-10 text-center space-y-2">
                <Users className="h-8 w-8 mx-auto text-niamind-muted/60" />
                <p className="text-sm text-niamind-muted">No sessions yet.</p>
                <p className="text-xs text-niamind-muted/80">
                    Sessions appear here once respondents start answering.
                </p>
            </div>
        );
    }

    const questionsById = useMemo(() => {
        const m = new Map();
        for (const q of questions) m.set(q.id, q);
        return m;
    }, [questions]);

    return (
        <div className="space-y-3">
            {sessions.map((s) => (
                <SessionRow key={s.id} session={s} questionsById={questionsById} />
            ))}
        </div>
    );
}

function SessionRow({ session, questionsById }) {
    const [open, setOpen] = useState(false);

    const qa = useMemo(() => {
        return (session.answers ?? [])
            .map((a) => ({ question: questionsById.get(a.question_id), answer: a }))
            .filter((x) => x.question)
            .sort((x, y) => x.question.order - y.question.order);
    }, [session.answers, questionsById]);

    return (
        <div className="bg-white rounded-2xl border border-niamind-border shadow-soft overflow-hidden">
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between gap-4 p-4 text-left hover:bg-niamind-bg/50 transition"
            >
                <div className="min-w-0">
                    <p className="font-semibold text-niamind-text truncate">
                        {participantLabel(session)}
                    </p>
                    <div className="flex flex-wrap gap-x-3 text-xs text-niamind-muted mt-1">
                        <span>started {formatDate(session.created_at)}</span>
                        {session.completed_at ? (
                            <span>completed {formatDate(session.completed_at)}</span>
                        ) : (
                            <span className="text-niamind-gold">in progress</span>
                        )}
                        <span>{qa.length} answered</span>
                    </div>
                </div>
                <span className="text-niamind-muted shrink-0">
                    {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </span>
            </button>

            {open && (
                <div className="border-t border-niamind-border bg-niamind-bg/30">
                    {qa.length === 0 ? (
                        <p className="p-4 text-sm text-niamind-muted">No answers recorded.</p>
                    ) : (
                        <ul className="divide-y divide-niamind-border">
                            {qa.map(({ question, answer }) => (
                                <li key={answer.id} className="p-4 space-y-1">
                                    <p className="text-xs text-niamind-muted">{question.text}</p>
                                    <p className="text-sm text-niamind-text">{formatAnswer(answer)}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

/* ---------------- Editor dialog ---------------- */

function QuestionEditorDialog({
    open, onOpenChange, questionnaireId, initial, nextOrder, existingKeys, onSaved,
}) {
    const isEdit = Boolean(initial);

    const [text, setText] = useState("");
    const [key, setKey] = useState("");
    const [type, setType] = useState("text");
    const [optionsText, setOptionsText] = useState("");
    const [required, setRequired] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open) return;
        setSubmitting(false);
        setError(null);

        if (isEdit) {
            setText(initial.text ?? "");
            setKey(initial.key ?? "");
            setType(initial.type ?? "text");
            setOptionsText((initial.options ?? []).join("\n"));
            setRequired(Boolean(initial.required));
        } else {
            setText("");
            setKey("");
            setType("text");
            setOptionsText("");
            setRequired(false);
        }
    }, [open, isEdit, initial]);

    async function handleSubmit() {
        if (!text.trim()) {
            setError("Question text is required.");
            return;
        }

        const isSelect = type !== "text";
        const opts = isSelect ? parseOptions(optionsText) : null;

        if (isSelect && opts.length === 0) {
            setError("Selection questions need at least one option.");
            return;
        }
        if (isSelect && new Set(opts.map((o) => o.toLowerCase())).size !== opts.length) {
            setError("Options must be unique.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            if (isEdit) {
                const updates = {};
                if (text.trim() !== initial.text) updates.text = text.trim();
                if (Boolean(required) !== Boolean(initial.required)) updates.required = required;
                if (isSelect) {
                    const oldOpts = initial.options ?? [];
                    if (JSON.stringify(opts) !== JSON.stringify(oldOpts)) updates.options = opts;
                }
                if (Object.keys(updates).length > 0) {
                    await apiRequest(`/api/questions/${initial.id}`, {
                        method: "PATCH",
                        body: updates,
                    });
                }
            } else {
                const derivedKey = key.trim() || deriveKey(text, existingKeys);
                await apiRequest("/api/questions/", {
                    method: "POST",
                    body: {
                        questionnaire_id: questionnaireId,
                        key: derivedKey,
                        text: text.trim(),
                        type,
                        placeholder: null,
                        options: isSelect ? opts : null,
                        order: nextOrder,
                        required,
                        is_active: true,
                    },
                });
            }
            onSaved?.();
        } catch (e) {
            setError(e?.message || (isEdit ? "Could not update." : "Could not create."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="ff-serif text-xl">
                        {isEdit ? "Edit question" : "Add question"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the wording, options, or required setting. Type and key are locked."
                            : "New questions appear at the bottom of the list."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="q-text">Question</Label>
                        <Textarea
                            id="q-text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="What would you like to ask?"
                            disabled={submitting}
                            className="min-h-[70px] border-niamind-border bg-white"
                        />
                    </div>

                    {isEdit ? (
                        <div className="flex items-center gap-2 text-xs text-niamind-muted">
                            <Badge variant="secondary" className="text-[10px]">{typeLabel(type)}</Badge>
                            <span className="font-mono">{key}</span>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="q-type">Type</Label>
                                <Select value={type} onValueChange={setType} disabled={submitting}>
                                    <SelectTrigger id="q-type" className="border-niamind-border bg-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {QUESTION_TYPES.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                {t.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="q-key">Key</Label>
                                <Input
                                    id="q-key"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    placeholder="auto-from-question"
                                    disabled={submitting}
                                    className="border-niamind-border bg-white font-mono text-sm"
                                />
                                <p className="text-xs text-niamind-muted">
                                    Stable identifier. Auto-derived if left blank.
                                </p>
                            </div>
                        </>
                    )}

                    {type !== "text" && (
                        <div className="space-y-2">
                            <Label htmlFor="q-options">Options (one per line)</Label>
                            <Textarea
                                id="q-options"
                                value={optionsText}
                                onChange={(e) => setOptionsText(e.target.value)}
                                placeholder={"Option A\nOption B\nOption C"}
                                disabled={submitting}
                                className="min-h-[90px] border-niamind-border bg-white font-mono text-sm"
                            />
                        </div>
                    )}

                    <label className="flex items-center gap-2 text-sm text-niamind-text cursor-pointer">
                        <input
                            type="checkbox"
                            checked={required}
                            onChange={(e) => setRequired(e.target.checked)}
                            disabled={submitting}
                            className="rounded border-niamind-border"
                        />
                        Required
                    </label>
                </div>

                {error && (
                    <p className="text-sm text-niamind-coral" role="alert">{error}</p>
                )}

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="bg-niamind-teal text-white hover:bg-niamind-teal/90"
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {isEdit ? "Saving…" : "Adding…"}
                            </>
                        ) : isEdit ? "Save changes" : "Add question"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

/* ---------------- helpers ---------------- */

function participantLabel(session) {
    return session.name?.trim() || session.email?.trim() || "Anonymous";
}

function formatAnswer(answer) {
    if (!answer) return "—";
    if (answer.answer_array?.length) return answer.answer_array.join(", ");
    if (answer.answer_text?.trim()) return answer.answer_text;
    return "—";
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
