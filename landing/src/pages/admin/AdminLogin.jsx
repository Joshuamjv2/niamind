import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartHandshake } from "lucide-react";
import { isValidCode, unlock } from "@/admin/auth";

export default function AdminLogin() {
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();
        if (!isValidCode(code)) {
            setError("Enter an access code.");
            return;
        }
        unlock();
        navigate("/admin", { replace: true });
    }

    return (
        <div className="min-h-screen flex flex-col bg-niamind-bg">
            {/* Header with centered brand */}
            <header className="border-b border-niamind-border bg-white/50 backdrop-blur">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-niamind-teal flex items-center justify-center shadow-sm">
                            <HeartHandshake className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="font-extrabold text-lg tracking-tight text-niamind-navy leading-tight">Niamind</p>
                            <p className="text-xs text-niamind-muted -mt-0.5">Admin</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-6 py-12">
                <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white rounded-2xl shadow-soft p-8 space-y-5">
                    <div>
                        <h1 className="ff-serif text-2xl text-niamind-text">Admin access</h1>
                        <p className="mt-1 text-sm text-niamind-muted">Enter the access code to continue.</p>
                    </div>

                    <input
                        type="password"
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setError(null);
                        }}
                        placeholder="Access code"
                        autoFocus
                        className="w-full rounded-xl border border-niamind-border px-4 py-3 text-niamind-text outline-none focus:border-niamind-teal"
                    />

                    {error && (
                        <p className="text-sm text-red-600" role="alert">
                            {error}
                        </p>
                    )}

                    <button type="submit" className="w-full bg-niamind-teal text-white font-bold text-sm py-3 rounded-full hover:opacity-90 transition">
                        Unlock
                    </button>
                </form>
            </main>

            {/* Footer */}
            <footer className="border-t border-niamind-border bg-white/50 backdrop-blur">
                <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-niamind-muted">
                    <p>© {new Date().getFullYear()} Niamind. All rights reserved.</p>
                    <nav className="flex items-center gap-4">
                        <a href="/privacy" className="hover:text-niamind-text transition">
                            Privacy
                        </a>
                        <a href="/terms" className="hover:text-niamind-text transition">
                            Terms
                        </a>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
