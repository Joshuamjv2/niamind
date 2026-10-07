import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSendResetLink = async () => {
    // API call to send reset password email
    // await forgotPassword({ email });
    
    // For demo purposes, just show success state
    setIsSubmitted(true);
  };

  return (
    <AuthLayout>
      <div>
        {/* HEADER */}
        <div className="mb-4 text-center flex gap-2 flex-col items-center justify-center">
          <h1 className="text-2xl 2xl:text-3xl block capitalize font-bold tracking-tight text-niamind-navy">
            Forgot password?
          </h1>

          {!isSubmitted ? (
            <p className="text-sm leading-5 hidden md:block text-niamind-muted italic max-w-[300px]">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          ) : (
            <p className="text-sm leading-5 hidden md:block text-niamind-muted italic max-w-[300px]">
              Check your email for a reset link.
            </p>
          )}
        </div>

        {/* FORM CARD */}
        <div className="">
          {!isSubmitted ? (
            <div className="space-y-4">
              {/* EMAIL */}
              <Input
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
              />

              {/* BUTTON */}
              <Button
                onClick={handleSendResetLink}
                className="w-full h-11 rounded-xl bg-niamind-teal hover:opacity-95 text-white font-semibold transition"
              >
                Send reset link
              </Button>

              {/* DIVIDER */}
              <div className="flex items-center gap-2 py-1">
                <div className="h-px flex-1 bg-niamind-border" />
                <span className="text-[11px] uppercase tracking-wider text-niamind-muted">
                  or
                </span>
                <div className="h-px flex-1 bg-niamind-border" />
              </div>

              {/* BACK TO LOGIN */}
              <Button
                variant="secondary"
                onClick={() => navigate("/login")}
                className="w-full h-11 rounded-xl border border-niamind-border bg-white hover:border-niamind-gold hover:text-niamind-gold text-niamind-navy transition"
              >
                Back to sign in
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-xl bg-niamind-teal/10 border border-niamind-teal/20 p-8 text-center">
                <p className="text-sm text-niamind-teal font-medium">
                  ✨ Reset link sent!
                </p>
                <p className="text-xs text-niamind-muted mt-2">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>

              {/* BACK TO LOGIN */}
              <a href="/login">
              <Button
                variant="secondary"
                onClick={() => navigate("/login")}
                className="w-full h-11 rounded-xl border border-niamind-border bg-white hover:border-niamind-gold hover:text-niamind-gold text-niamind-navy transition mt-4"
              >
                Back to sign in
              </Button>
              </a>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {!isSubmitted && (
          <div className="m-4 text-center text-sm text-niamind-muted">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-niamind-gold hover:opacity-70 transition"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
