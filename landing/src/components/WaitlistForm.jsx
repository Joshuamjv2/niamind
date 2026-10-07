import React, { useMemo, useState } from "react";
import { countries } from "country-codes-flags-phone-codes";
import { isValidPhoneNumber } from "libphonenumber-js";

export default function WaitlistForm() {
    const [role, setRole] = useState("seeker");
    const [email, setEmail] = useState("");
    const [countryCode, setCountryCode] = useState("+256");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [submitted, setSubmitted] = useState(false);

    // Full sorted list of countries from the package
    const countryList = useMemo(() => {
        return [...countries].sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    // Clean phone digits
    const cleanedPhone = useMemo(() => phone.replace(/[^\d]/g, ""), [phone]);

    // Validate phone number using libphonenumber-js
    const validatePhone = (rawPhone, dialCode) => {
        if (!rawPhone.trim()) {
            setPhoneError("");
            return false;
        }
        const fullNumber = `${dialCode}${rawPhone.replace(/[^\d]/g, "")}`;
        if (isValidPhoneNumber(fullNumber)) {
            setPhoneError("");
            return true;
        } else {
            setPhoneError(
                "Please enter a valid phone number for the selected country.",
            );
            return false;
        }
    };

    const handlePhoneChange = (e) => {
        const raw = e.target.value;
        setPhone(raw);
        validatePhone(raw, countryCode);
    };

    const handleCountryChange = (e) => {
        const newCode = e.target.value;
        setCountryCode(newCode);
        // Re‑validate when country changes
        validatePhone(phone, newCode);
    };

    function submit(e) {
        e.preventDefault();

        if (!email.trim()) return;
        if (!validatePhone(phone, countryCode)) return;

        const fullPhone = `${countryCode}${cleanedPhone}`;
        console.log("WAITLIST SUBMISSION:", { role, email, phone: fullPhone });
        setSubmitted(true);
    }

    return (
        <div className="h-full rounded-2xl bg-white border border-niamind-border shadow-card p-7 flex flex-col">
            <h3 className="text-xl font-extrabold text-niamind-navy">
                Join the waitlist
            </h3>

            <p className="mt-2 text-sm text-niamind-muted leading-relaxed">
                Get early access and join our WhatsApp community for updates,
                feedback, and launch announcements.
            </p>

            {/* ROLE TOGGLE */}
            <div className="mt-5 rounded-2xl bg-niamind-bg border border-niamind-border p-2 flex gap-2">
                <button
                    type="button"
                    onClick={() => setRole("seeker")}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition ${
                        role === "seeker"
                            ? "bg-niamind-teal text-white shadow-sm"
                            : "text-niamind-muted hover:bg-white"
                    }`}
                >
                    Interested
                </button>

                <button
                    type="button"
                    onClick={() => setRole("professional")}
                    className={`flex-1 px-4 py-2 rounded-xl text-sm font-bold transition ${
                        role === "professional"
                            ? "bg-niamind-teal text-white shadow-sm"
                            : "text-niamind-muted hover:bg-white"
                    }`}
                >
                    <span className="hidden">I'm a</span> Professional
                </button>
            </div>

            <form onSubmit={submit} className="mt-5 flex flex-col gap-4 flex-1">
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    type="email"
                    className="px-4 py-3 rounded-xl border border-niamind-border outline-none focus:ring-2 focus:ring-niamind-teal/30"
                />

                {/* PHONE INPUT with full country list */}
                <div>
                    <div className="grid grid-cols-3 gap-3">
                        <select
                            value={countryCode}
                            onChange={handleCountryChange}
                            className="col-span-1 px-4 py-3 rounded-xl border border-niamind-border outline-none focus:ring-2 focus:ring-niamind-teal/30 bg-white text-sm font-semibold text-niamind-navy"
                        >
                            {countryList.map((country) => (
                                <option
                                    key={country.code}
                                    value={country.dialCode}
                                >
                                    {country.flag} {country.dialCode} (
                                    {country.code})
                                </option>
                            ))}
                        </select>

                        <input
                            value={phone}
                            onChange={handlePhoneChange}
                            placeholder="WhatsApp number"
                            className={`col-span-2 px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-niamind-teal/30 ${
                                phoneError
                                    ? "border-red-400 bg-red-50"
                                    : "border-niamind-border"
                            }`}
                        />
                    </div>
                    {phoneError && (
                        <p className="mt-1 text-xs text-red-500">
                            {phoneError}
                        </p>
                    )}
                </div>

                {/* SUBMIT BUTTON */}
                <button
                    type="submit"
                    disabled={submitted}
                    className={`w-full px-4 py-3 rounded-xl font-bold text-sm transition ${
                        submitted
                            ? "bg-niamind-green text-white cursor-not-allowed"
                            : "bg-niamind-navy text-white hover:opacity-95"
                    }`}
                >
                    {submitted
                        ? "You're in. We'll reach out soon."
                        : "Join waitlist"}
                </button>

                {/* SUCCESS TEXT - now visible when submitted */}
                {submitted && (
                    <div className="rounded-2xl bg-niamind-green/10 border border-niamind-green/20 p-4">
                        <p className="text-sm font-bold text-niamind-green">
                            Success — you've joined the waitlist.
                        </p>
                        <p className="mt-1 text-sm text-niamind-muted leading-relaxed">
                            We'll contact you soon and invite you to the
                            WhatsApp community.
                        </p>
                    </div>
                )}

                <p className="text-xs text-niamind-muted leading-relaxed mt-auto">
                    By joining, you agree to receive updates about Niamind. Your
                    information will never be sold or shared.
                </p>
            </form>
        </div>
    );
}
