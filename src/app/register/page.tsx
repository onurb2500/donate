"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push("/");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Erro ao cadastrar.");
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="flex w-[400px] max-w-full flex-col items-center gap-3 text-center">
        <span className="flex h-[66px] w-[66px] items-center justify-center rounded-card bg-terracotta/15 text-3xl text-terracotta">
          ♥
        </span>
        <h1 className="font-display text-[31px] font-semibold text-ink">Vaquinha</h1>
        <p className="text-muted">Comece a transformar histórias hoje.</p>
      </div>

      <div className="card w-[400px] max-w-full p-[30px_26px] shadow-auth-card">
        <h2 className="mb-5 font-display text-2xl font-semibold text-ink">Criar conta</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">Nome</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="field"
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="field"
            />
          </div>
          {error && <p className="alert-error">{error}</p>}
          <button type="submit" className="btn-primary">
            Cadastrar
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-body">
          Já tem conta?{" "}
          <Link href="/login" className="font-bold text-terracotta">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  );
}
