"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PasswordPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError("Incorrect password. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141217] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl mx-auto mb-4 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-[#f2efed]">Squad Dashboard</h1>
          <p className="text-[rgba(242,239,237,0.6)] mt-2">Enter password to continue</p>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="bg-[#1f1d23] rounded-xl p-6 shadow-xl border border-[rgba(242,239,237,0.1)]">
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-[rgba(242,239,237,0.7)] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-[#141217] border border-[rgba(242,239,237,0.2)] rounded-lg text-[#f2efed] placeholder-[rgba(242,239,237,0.4)] focus:outline-none focus:border-[#fec62e] focus:ring-1 focus:ring-[#fec62e] transition-colors"
                placeholder="Enter password"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[rgba(242,239,237,0.5)] hover:text-[#f2efed] transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  /* Eye off icon */
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  /* Eye icon */
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] rounded-lg">
              <p className="text-sm text-[#ef4444]">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-[15px] transition-all ${
              isLoading || !password
                ? "bg-[rgba(242,239,237,0.1)] text-[rgba(242,239,237,0.3)] cursor-not-allowed"
                : "bg-[#fec62e] text-[#141217] hover:bg-[#ffd563] active:scale-[0.98]"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[rgba(242,239,237,0.4)] text-sm mt-6">
          Protected content • Contact admin for access
        </p>
      </div>
    </div>
  );
}

