"use client";

import { CircleUser, LogIn } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const hasSupabase =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const loginWithPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    if (!hasSupabase) {
      setMessage("Add Supabase environment variables to enable admin login.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      return;
    }
    window.location.href = "/admin/dashboard";
  };

  const loginWithGoogle = async () => {
    if (!hasSupabase) {
      setMessage("Add Supabase environment variables to enable Google login.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin/dashboard` },
    });
  };

  return (
    <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#111111]/85 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
      <form onSubmit={loginWithPassword} className="grid gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-12 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm outline-none focus:border-[#D4AF37]/70"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="h-12 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm outline-none focus:border-[#D4AF37]/70"
        />
        {message && <p className="text-sm text-red-300">{message}</p>}
        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 text-sm font-semibold text-black hover:bg-[#E8C76A]">
          <LogIn size={17} />
          Login
        </button>
      </form>
      <button
        type="button"
        onClick={loginWithGoogle}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 text-sm font-semibold text-white hover:border-[#D4AF37]/60 hover:text-[#E8C76A]"
      >
        <CircleUser size={17} />
        Continue with Google
      </button>
    </div>
  );
}
