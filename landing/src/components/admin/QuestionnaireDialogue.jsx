import React, { useEffect, useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const QUESTION_TYPES = [
    { value: "text", label: "Text" },
    { value: "single_select", label: "Single choice" },
    { value: "multiselect", label: "Multiple choice" },
];

const SLUG_RE = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

function emptyQuestion() {
    return {
        uid: crypto.randomUUID(),
        text: "",
        type: "text",
        optionsText: "",
        required: false,
    };
}

function slugify(value) {
    return (value || "")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[‘’']/g, "")
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
}

function deriveUniqueKey(text, existing) {
    const base = slugify(text) || "question";
    let key = base;
    let n = 2;
    while (existing.has(key)) key = `${base}_${n++}`;
    return key;
}

function parseOptions(text) {
    return text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
}

export default function CreateQuestionnaireDialog({ open, onOpenChange, onCreated, initial }) {
    const isEdit = Boolean(initial);

    const [label, setLabel] = useState("");
    const [slug, setSlug] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [isActive, setIsActive] = useState(true);
    const [questions, setQuestions] = useState([emptyQuestion()]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Reset on open — populate from `initial` in edit mode, defaults otherwise
    useEffect(() => {
        if (!open) return;
        setSubmitting(false);
        setError(null);

        if (isEdit) {
            setLabel(initial.label ?? "");
            setSlug(initial.slug ?? "");
            setSlugTouched(true);      // don't auto-derive from label on edit
            setIsActive(initial.is_active ?? true);
            setQuestions([]);          // unused in edit mode
        } else {
            setLabel("");
            setSlug("");
            setSlugTouched(false);
            setIsActive(true);
            setQuestions([emptyQuestion()]);
        }
    }, [open, isEdit, initial]);

    // Auto-derive slug from label — create mode only
    useEffect(() => {
        if (!isEdit && !slugTouched) setSlug(slugify(label));
    }, [label, slugTouched, isEdit]);

    function updateQuestion(uid, patch) {
        setQuestions((prev) => prev.map((q) => (q.uid === uid ? { ...q, ...patch } : q)));
    }

    function addQuestion() {
        setQuestions((prev) => [...prev, emptyQuestion()]);
    }

    function removeQuestion(uid) {
        setQuestions((prev) => prev.filter((q) => q.uid !== uid));
    }

    function moveQuestion(uid, dir) {
        setQuestions((prev) => {
            const idx = prev.findIndex((q) => q.uid === uid);
            const j = idx + dir;
            if (idx === -1 || j < 0 || j >= prev.length) return prev;
            const next = [...prev];
            [next[idx], next[j]] = [next[j], next[idx]];
            return next;
        });
    }

    function validateShell() {
        if (!label.trim()) return "Label is required.";
        if (!slug.trim()) return "Slug is required.";
        if (!SLUG_RE.test(slug)) {
            return "Slug must be lowercase letters, digits, hyphens or underscores.";
        }
        return null;
    }

    function validateQuestions() {
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const n = i + 1;
            if (!q.text.trim()) return `Question ${n} has no text.`;
            if (q.type !== "text") {
                const opts = parseOptions(q.optionsText);
                if (opts.length === 0) return `Question ${n} needs at least one option.`;
                if (new Set(opts.map((o) => o.toLowerCase())).size !== opts.length) {
                    return `Question ${n} has duplicate options.`;
                }
            }
        }
        return null;
    }

    async function submitCreate() {
        const shellError = validateShell();
        if (shellError) return shellError;
        const questionsError = validateQuestions();
        if (questionsError) return questionsError;

        const existingKeys = new Set();
        const payload = {
            label: label.trim(),
            slug: slug.trim(),
            is_active: isActive,
            questions: questions.map((q, idx) => {
                const key = deriveUniqueKey(q.text, existingKeys);
                existingKeys.add(key);
                const isSelect = q.type !== "text";
                return {
                    key,
                    text: q.text.trim(),
                    type: q.type,
                    placeholder: null,
                    options: isSelect ? parseOptions(q.optionsText) : null,
                    order: idx,
                    required: q.required,
                    is_active: true,
                };
            }),
        };

        const created = await apiRequest("/api/questionnaires/", {
            method: "POST",
            body: payload,
        });
        onCreated?.(created);
        onOpenChange(false);
    }

    async function submitEdit() {
        const shellError = validateShell();
        if (shellError) return shellError;

        // Only send fields that actually changed — keeps PATCH minimal and
        // avoids tripping the backend's exclude_none semantics on untouched values.
        const updates = {};
        if (label.trim() !== (initial.label ?? "")) updates.label = label.trim();
        if (slug.trim() !== (initial.slug ?? "")) updates.slug = slug.trim();
        if (isActive !== initial.is_active) updates.is_active = isActive;

        if (Object.keys(updates).length === 0) {
            // Nothing changed — close without a network call
            onOpenChange(false);
            return;
        }

        const updated = await apiRequest(`/api/questionnaires/${initial.id}`, {
            method: "PATCH",
            body: updates,
        });
        onCreated?.(updated);
        onOpenChange(false);
    }

    async function handleSubmit() {
        setSubmitting(true);
        setError(null);
        try {
            const validationError = isEdit ? await submitEdit() : await submitCreate();
            if (validationError) setError(validationError);
        } catch (e) {
            setError(e?.message || (isEdit ? "Could not update the questionnaire." : "Could not create the questionnaire."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !submitting && onOpenChange(v)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="ff-serif text-2xl">
                        {isEdit ? `Edit ${initial?.label ?? "questionnaire"}` : "New questionnaire"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Update the label, slug, or active status. Questions are edited from the detail page."
                            : "Build the questionnaire and its questions in one go."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-2">
                    {/* Label */}
                    <div className="space-y-2">
                        <Label htmlFor="q-label">Label</Label>
                        <Input
                            id="q-label"
                            value={label}
                            onChange={(e) => setLabel(e.target.value)}
                            placeholder="e.g. Focus Areas"
                            disabled={submitting}
                            className="border-niamind-border bg-white"
                        />
                    </div>

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="q-slug">Slug</Label>
                        <Input
                            id="q-slug"
                            value={slug}
                            onChange={(e) => {
                                setSlugTouched(true);
                                setSlug(e.target.value);
                            }}
                            placeholder="auto-from-label"
                            disabled={submitting}
                            className="border-niamind-border bg-white font-mono"
                        />
                        <p className="text-xs text-niamind-muted">
                            {isEdit
                                ? "Changing the slug breaks existing links to this questionnaire."
                                : slugTouched
                                  ? "Editing manually."
                                  : "Auto-derived from label. Click to edit."}
                        </p>
                    </div>

                    {/* Active toggle */}
                    <div className="flex items-center justify-between rounded-xl border border-niamind-border px-4 py-3">
                        <div>
                            <Label className="text-sm">Active</Label>
                            <p className="text-xs text-niamind-muted">
                                Inactive questionnaires are hidden from respondents.
                            </p>
                        </div>
                        <Switch checked={isActive} onCheckedChange={setIsActive} disabled={submitting} />
                    </div>

                    {/* Questions — create only */}
                    {isEdit ? (
                        <div className="rounded-xl border border-niamind-border bg-niamind-bg/40 px-4 py-3 text-sm text-niamind-muted">
                            Questions are edited individually from the questionnaire detail page.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Label className="text-sm font-semibold">
                                    Questions ({questions.length})
                                </Label>
                                <Button type="button" variant="outline" size="sm" onClick={addQuestion} disabled={submitting}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add question
                                </Button>
                            </div>

                            {questions.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-niamind-border p-6 text-center text-sm text-niamind-muted">
                                    No questions yet. You can also add them later from the detail page.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {questions.map((q, idx) => (
                                        <QuestionEditor
                                            key={q.uid}
                                            index={idx}
                                            question={q}
                                            onChange={(patch) => updateQuestion(q.uid, patch)}
                                            onRemove={() => removeQuestion(q.uid)}
                                            onMoveUp={() => moveQuestion(q.uid, -1)}
                                            onMoveDown={() => moveQuestion(q.uid, 1)}
                                            isFirst={idx === 0}
                                            isLast={idx === questions.length - 1}
                                            disabled={submitting}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-sm text-niamind-coral" role="alert">
                        {error}
                    </p>
                )}

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={submitting} className="bg-niamind-teal text-white hover:bg-niamind-teal/90">
                        {submitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {isEdit ? "Saving…" : "Creating…"}
                            </>
                        ) : isEdit ? (
                            "Save changes"
                        ) : (
                            "Create questionnaire"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function QuestionEditor({ index, question, onChange, onRemove, onMoveUp, onMoveDown, isFirst, isLast, disabled }) {
    const isSelect = question.type !== "text";

    return (
        <div className="rounded-xl border border-niamind-border bg-niamind-bg/30 p-3 space-y-3">
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-niamind-muted">#{index + 1}</span>
                <div className="flex items-center gap-1">
                    <Button type="button" variant="ghost" size="icon" onClick={onMoveUp} disabled={isFirst || disabled} className="h-7 w-7 text-niamind-muted" aria-label="Move up">
                        <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onMoveDown}
                        disabled={isLast || disabled}
                        className="h-7 w-7 text-niamind-muted"
                        aria-label="Move down"
                    >
                        <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={onRemove}
                        disabled={disabled}
                        className="h-7 w-7 text-niamind-coral hover:text-niamind-coral hover:bg-niamind-coral/10"
                        aria-label="Remove question"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <Textarea
                value={question.text}
                onChange={(e) => onChange({ text: e.target.value })}
                placeholder="What would you like to ask?"
                disabled={disabled}
                className="min-h-[60px] text-sm border-niamind-border bg-white"
            />

            <div className="flex flex-wrap items-center gap-3">
                <Select value={question.type} onValueChange={(v) => onChange({ type: v })} disabled={disabled}>
                    <SelectTrigger className="w-[170px] h-9 text-sm border-niamind-border bg-white">
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

                <label className="flex items-center gap-2 text-sm text-niamind-text cursor-pointer">
                    <input
                        type="checkbox"
                        checked={question.required}
                        onChange={(e) => onChange({ required: e.target.checked })}
                        disabled={disabled}
                        className="rounded border-niamind-border"
                    />
                    Required
                </label>
            </div>

            {isSelect && (
                <div className="space-y-1">
                    <Label className="text-xs text-niamind-muted">Options (one per line)</Label>
                    <Textarea
                        value={question.optionsText}
                        onChange={(e) => onChange({ optionsText: e.target.value })}
                        placeholder={"Option A\nOption B\nOption C"}
                        disabled={disabled}
                        className="min-h-[70px] text-sm border-niamind-border bg-white font-mono"
                    />
                </div>
            )}
        </div>
    );
}
