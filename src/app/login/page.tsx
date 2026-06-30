"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao entrar.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-[400px] max-w-full flex-col items-center gap-3 text-center">
        <span className="flex h-[66px] w-[66px] items-center justify-center rounded-card bg-terracotta/15 text-3xl text-terracotta">
          ♥
        </span>
        <h1 className="font-display text-[31px] font-semibold text-ink">Vaquinha</h1>
        <p className="text-muted">Pequenos gestos, grandes histórias.</p>
      </div>

      <div className="card w-[400px] max-w-full p-[30px_26px] shadow-auth-card">
        <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Entrar</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">E-mail</label>
            <input
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="field"
            />
          </div>
          <div>
            <label className="label">Senha</label>
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="field"
            />
          </div>
          {error && <p className="alert-error">{error}</p>}
          <button type="submit" className="btn-primary">
            Entrar
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-body">
          Ainda não tem conta?{" "}
          <Link href="/register" className="font-bold text-terracotta">
            Cadastre-se
          </Link>
        </p>
      </div>
    </main>
  );
}
