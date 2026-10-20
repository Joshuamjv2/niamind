import React, { useEffect, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { apiRequest } from "@/utils/api";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 100;

export default function WaitlistView() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [query, setQuery] = useState("");

    async function fetchPage(offset) {
        const data = await apiRequest(`/api/waitlist/?limit=${PAGE_SIZE}&offset=${offset}`);
        return Array.isArray(data) ? data : [];
    }

    async function load() {
        setLoading(true);
        setError(null);
        try {
            const page = await fetchPage(0);
            setItems(page);
            setHasMore(page.length === PAGE_SIZE);
        } catch (e) {
            setError(e?.message || "Could not load the waitlist.");
        } finally {
            setLoading(false);
        }
    }

    async function loadMore() {
        setLoadingMore(true);
        setError(null);
        try {
            const page = await fetchPage(items.length);
            setItems((prev) => [...prev, ...page]);
            setHasMore(page.length === PAGE_SIZE);
        } catch (e) {
            setError(e?.message || "Could not load more entries.");
        } finally {
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleDelete(item) {
        // TEMP: swap for a shadcn AlertDialog when the popup utility lands.
        const ok = window.confirm(`Remove ${item.email} from the waitlist?`);
        if (!ok) return;

        setDeletingId(item.id);
        setError(null);
        try {
            await apiRequest(`/api/waitlist/${item.id}`, { method: "DELETE" });
            setItems((prev) => prev.filter((x) => x.id !== item.id));
        } catch (e) {
            if (e?.status === 404) {
                setItems((prev) => prev.filter((x) => x.id !== item.id));
            } else {
                setError(e?.message || "Could not remove that entry.");
            }
        } finally {
            setDeletingId(null);
        }
    }

    const q = query.trim().toLowerCase();
    const filtered = q ? items.filter((item) => item.name?.toLowerCase().includes(q) || item.email?.toLowerCase().includes(q)) : items;

    return (
        <div className="space-y-4 mt-4">
            <div className="flex items-start justify-between gap-4">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-niamind-muted pointer-events-none" />
                    <Input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or email"
                        className="pl-9 border-niamind-border bg-white focus-visible:ring-niamind-teal/30 focus-visible:border-niamind-teal"
                    />
                </div>
                <Button variant="ghost" onClick={load} disabled={loading} className="bg-niamind-teal/10 text-niamind-teal hover:bg-niamind-teal/20 hover:text-niamind-teal">
                    Refresh
                </Button>
            </div>

            {q && !loading && (
                <p className="text-xs text-niamind-muted">
                    {filtered.length} {filtered.length === 1 ? "match" : "matches"} of {items.length} loaded
                </p>
            )}

            {error && (
                <p className="text-sm text-niamind-coral" role="alert">
                    {error}
                </p>
            )}

            <div className="bg-white rounded-2xl border border-niamind-border shadow-soft overflow-hidden">
                <Table>
                    <TableHeader className="bg-niamind-bg">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-niamind-muted">Email</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-niamind-muted">Name</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-niamind-muted">Phone</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-niamind-muted">Joined</TableHead>
                            <TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-niamind-muted text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && (
                            <TableRow className="last:border-b-0 hover:bg-transparent">
                                <TableCell colSpan={5} className="px-4 py-10 text-center text-niamind-muted">
                                    Loading…
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && items.length === 0 && (
                            <TableRow className="last:border-b-0 hover:bg-transparent">
                                <TableCell colSpan={5} className="px-4 py-10 text-center text-niamind-muted">
                                    No one on the waitlist yet.
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && items.length > 0 && filtered.length === 0 && (
                            <TableRow className="last:border-b-0 hover:bg-transparent">
                                <TableCell colSpan={5} className="px-4 py-10 text-center text-niamind-muted">
                                    No entries match “{query.trim()}”.
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading &&
                            filtered.map((item) => (
                                <TableRow key={item.id} className="hover:bg-niamind-bg/60 last:border-b-0">
                                    <TableCell className="px-4 py-3 text-niamind-text">
                                        <a href={`mailto:${item.email}`} className="hover:underline">
                                            {item.email}
                                        </a>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-niamind-text">{item.name?.trim() || ""}</TableCell>
                                    <TableCell className="px-4 py-3 text-niamind-text">{formatPhone(item)}</TableCell>
                                    <TableCell className="px-4 py-3 text-niamind-muted whitespace-nowrap">{formatDate(item.created_at)}</TableCell>
                                    <TableCell className="px-4 py-3 text-right">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(item)}
                                            disabled={deletingId === item.id}
                                            aria-label={`Remove ${item.email}`}
                                            className="text-niamind-coral hover:text-niamind-coral hover:bg-niamind-coral/10 disabled:opacity-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                {!loading && hasMore && !q && (
                    <div className="border-t border-niamind-border px-4 py-3 text-center">
                        <Button variant="ghost" onClick={loadMore} disabled={loadingMore} className="text-niamind-teal hover:bg-transparent hover:underline">
                            {loadingMore ? "Loading…" : "Load more"}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

function formatPhone(item) {
    if (item.phone_e164) return item.phone_e164;
    if (item.phone_national) {
        return item.phone_country_code ? `${item.phone_country_code} ${item.phone_national}` : item.phone_national;
    }
    return "";  // "_"
}

function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return String(value);
    return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
