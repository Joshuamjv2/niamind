import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { HeartHandshake, Lock, Menu, X } from "lucide-react";
import { lock } from "@/admin/auth";

const NAV_ITEMS = [
    { to: "/admin/waitlist", label: "Waitlist" },
    { to: "/admin/questionnaires", label: "Questionnaires" },
];

export default function AdminNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    // Close on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // Close on Escape
    useEffect(() => {
        if (!menuOpen) return;
        function onKey(e) {
            if (e.key === "Escape") setMenuOpen(false);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [menuOpen]);

    // Close on click outside (excluding the toggle button)
    useEffect(() => {
        if (!menuOpen) return;
        function onMouseDown(e) {
            if (menuRef.current?.contains(e.target)) return;
            if (buttonRef.current?.contains(e.target)) return;
            setMenuOpen(false);
        }
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, [menuOpen]);

    function handleLock() {
        lock();
        navigate("/admin/login", { replace: true });
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-niamind-bg/85 backdrop-blur border-b border-niamind-border">
            <div className="mx-auto max-w-6xl px-4 sm:px-5 py-3 md:py-4 flex items-center justify-between gap-3 sm:gap-4">
                {/* Brand */}
                <NavLink to="/admin" className="flex items-center gap-3 py-2 px-2 sm:px-4 rounded-3xl min-w-0">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-niamind-teal flex items-center justify-center shadow-sm">
                        <HeartHandshake className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                        <p className="font-extrabold text-lg tracking-tight text-niamind-navy leading-tight truncate">Niamind</p>
                        <p className="text-xs text-niamind-muted -mt-0.5">Admin</p>
                    </div>
                </NavLink>

                {/* Desktop links */}
                <nav className="hidden sm:flex items-center gap-1 md:gap-2">
                    {NAV_ITEMS.map((item) => (
                        <AdminLink key={item.to} to={item.to}>
                            {item.label}
                        </AdminLink>
                    ))}
                </nav>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleLock}
                        aria-label="Lock admin"
                        className="inline-flex cursor-pointer shrink-0 items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-niamind-teal text-white text-sm font-bold shadow-sm hover:opacity-90 transition"
                    >
                        <Lock className="h-4 w-4" />
                        <span className="hidden sm:inline">Lock</span>
                    </button>

                    <button
                        ref={buttonRef}
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="admin-mobile-menu"
                        className="sm:hidden inline-flex cursor-pointer items-center justify-center h-10 w-10 rounded-xl border border-niamind-border bg-white text-niamind-text hover:bg-niamind-border/40 transition"
                    >
                        {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div ref={menuRef} id="admin-mobile-menu" className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-niamind-border shadow-soft">
                    <nav className="px-4 py-3 flex flex-col gap-1">
                        {NAV_ITEMS.map((item) => (
                            <MobileLink key={item.to} to={item.to} onClick={() => setMenuOpen(false)}>
                                {item.label}
                            </MobileLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}

function AdminLink({ to, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                [
                    "px-4 py-2.5 rounded-xl text-sm font-semibold transition",
                    isActive ? "bg-niamind-teal/10 text-niamind-teal" : "text-niamind-muted hover:text-niamind-text hover:bg-niamind-border/40",
                ].join(" ")
            }
        >
            {children}
        </NavLink>
    );
}

function MobileLink({ to, children, onClick }) {
    return (
        <NavLink
            to={to}
            onClick={onClick}
            className={({ isActive }) =>
                [
                    "block px-4 py-3 rounded-xl text-sm font-semibold transition",
                    isActive ? "bg-niamind-teal/10 text-niamind-teal" : "text-niamind-muted hover:text-niamind-text hover:bg-niamind-border/40",
                ].join(" ")
            }
        >
            {children}
        </NavLink>
    );
}

