import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AuthLayout from "../../layouts/AuthLayout";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleResetPassword = async () => {
    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // API call to reset password
    // await resetPassword({ token, password });
    
    // For demo purposes, just show success state
    setIsSubmitted(true);
    setError("");
  };

  // If no token is provided, show error
  if (!token && !isSubmitted) {
    return (
      <AuthLayout>
        <div>
          <div className="mb-4 text-center flex gap-2 flex-col items-center justify-center">
            <h1 className="text-2xl 2xl:text-3xl block capitalize font-bold tracking-tight text-niamind-navy">
              Invalid reset link
            </h1>
            <p className="text-sm leading-4 hidden md:block text-niamind-muted max-w-[300px]">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <Button
            onClick={() => navigate("/forgot-password")}
            className="w-full h-11 rounded-xl bg-niamind-teal hover:opacity-95 text-white font-semibold transition"
          >
            Request new reset link
          </Button>

          <div className="mt-4 mb-2 text-center text-sm text-niamind-muted">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-niamind-teal hover:opacity-70 transition"
            >
              Sign in
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div>
        {/* HEADER */}
        <div className="mb-4 text-center flex gap-2 flex-col items-center justify-center">
          <h1 className="text-2xl 2xl:text-3xl block capitalize font-bold tracking-tight text-niamind-navy">
            Create new password
          </h1>

          {!isSubmitted ? (
            <p className="text-sm leading-5 hidden md:block text-niamind-muted italic max-w-[300px]">
              Your new password must be different from your previous password.
            </p>
          ) : (
            <p className="text-sm leading-5 hidden md:block text-niamind-gold italic max-w-[300px]">
              Password reset successful!
            </p>
          )}
        </div>

        {/* FORM CARD */}
        <div className="">
          {!isSubmitted ? (
            <div className="space-y-4">
              {/* NEW PASSWORD */}
              <div className="relative">
                <Input
                  label="New password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[38px] text-niamind-muted hover:text-niamind-teal transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <Input
                  label="Confirm new password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-[38px] text-niamind-muted hover:text-niamind-teal transition"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* ERROR MESSAGE */}
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}

              {/* PASSWORD REQUIREMENTS */}
              <div className="mt-2 text-xs text-niamind-muted space-y-1">
                <p className="font-medium">Password requirements:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li className={password.length >= 8 ? "text-niamind-teal" : ""}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(password) ? "text-niamind-teal" : ""}>
                    At least one uppercase letter
                  </li>
                  <li className={/[0-9]/.test(password) ? "text-niamind-teal" : ""}>
                    At least one number
                  </li>
                </ul>
              </div>

              {/* BUTTON */}
              <Button
                onClick={handleResetPassword}
                className="w-full h-11 rounded-xl bg-niamind-teal hover:opacity-95 text-white font-semibold transition mt-4"
              >
                Reset password
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl bg-niamind-teal/10 border border-niamind-teal/20 p-4 text-center">
                <p className="text-sm text-niamind-teal font-medium">
                  ✓ Password reset successful!
                </p>
                <p className="text-xs text-niamind-muted mt-2">
                  Your password has been updated. You can now sign in with your new password.
                </p>
              </div>

              {/* GO TO LOGIN */}
              <Button
                onClick={() => navigate("/login")}
                className="w-full h-11 rounded-xl bg-niamind-teal hover:opacity-95 text-white font-semibold transition mt-4"
              >
                Sign in
              </Button>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {!isSubmitted && (
          <div className="mt-4 mb-2 text-center text-sm text-niamind-muted">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/login")}
              className="font-semibold text-niamind-teal hover:opacity-70 transition"
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}