import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isUnlocked } from "@/admin/auth";
import AdminNavbar from "@/components/admin/Navbar";

export default function AdminApp() {
    if (!isUnlocked()) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className="min-h-screen bg-niamind-bg">
            <AdminNavbar />
            <main className="max-w-6xl mx-auto px-5 md:px-6 pt-20 md:pt-24 pb-16">
                <Outlet />
            </main>
        </div>
    );
}
