import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";

export default function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Mock user role based on email
    let role = "seeker"; // default role
    
    if (email.includes("professional") || email === "professional@niamind.com") {
      role = "professional";
    }
    
    await login({
      email: email || "demo@niamind.com",
    });
    
    // Navigate based on the email domain/content
    if (role === "professional") {
      navigate("/professional");
    } else {
      navigate("/seeker");
    }
  };

  const handleGoogleLogin = async () => {
    await login({
      email: "googleuser@niamind.com",
    });
    
    // Default to seeker for Google login
    navigate("/seeker");
  };

  return (
    <AuthLayout>
      <div className="">
        {/* HEADER */}
        <div className="mb-4 text-center flex gap-1 flex-col items-center justify-center">
          <h1 className="text-2xl 2xl:text-3xl block capitalize font-bold tracking-tight text-niamind-navy">
            Welcome back
          </h1>

          <p className="text-sm leading-5 hidden md:block text-niamind-muted italic max-w-[300px]">
            Continue your wellness journey in a safe,
            calm, and supportive space.
          </p>
          
          
        </div>

        {/* FORM CARD */}
        <div className="">
          <div className="space-y-3">
            {/* EMAIL */}
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            {/* PASSWORD */}
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {/* FORGOT */}
            <div className="flex justify-end">
              <a href="/forgot_password">
                <button className="font-semibold text-niamind-gold hover:opacity-70 transition text-sm">
                  Forgot password?
                </button>
              </a>
            </div>

            {/* BUTTON */}
            <Button
              onClick={handleLogin}
              className="w-full h-11 rounded-xl bg-niamind-teal hover:opacity-95 text-white font-semibold transition"
            >
              Sign in
            </Button>

            {/* DIVIDER */}
            <div className="flex items-center gap-2 py-1">
              <div className="h-px flex-1 bg-niamind-border" />
              <span className="text-[11px] uppercase tracking-wider text-niamind-muted">
                or
              </span>
              <div className="h-px flex-1 bg-niamind-border" />
            </div>

            {/* GOOGLE */}
            <Button
              variant="secondary"
              onClick={handleGoogleLogin}
              className="w-full h-11 rounded-xl border border-niamind-border bg-white hover:border-niamind-gold hover:text-niamind-gold text-niamind-navy transition"
            >
              Continue with Google
            </Button>

            {/* SECURITY */}
            <p className="pt-1 text-center text-xs text-niamind-muted">
              Private • Secure • Encrypted
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 mb-2 text-center text-sm text-niamind-muted">
          Don&apos;t have an account?{" "}
          <button className="font-semibold text-niamind-gold hover:opacity-70 transition">
            Create account
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}