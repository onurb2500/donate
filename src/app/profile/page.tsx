"use client";

import { useEffect, useState, type FormEvent } from "react";

export default function ProfilePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setEmail(data.email);
        setName(data.name);
      });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");
    setError("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      setMessage("Dados atualizados ♥");
    } else {
      const data = await res.json();
      setError(data.error ?? "Erro ao atualizar.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-[440px] flex-1 px-5 py-9">
      <header className="mb-6">
        <h1 className="font-display text-[28px] font-semibold text-ink">Meu cadastro</h1>
        <p className="text-muted">Seus dados na Vaquinha.</p>
      </header>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-[28px_26px]">
        {message && <p className="alert-success">{message}</p>}
        <div>
          <label className="label">E-mail</label>
          <input
            type="email"
            value={email}
            disabled
            className="field cursor-not-allowed bg-disabled-bg text-disabled-text"
          />
        </div>
        <div>
          <label className="label">Nome</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="field"
          />
        </div>
        {error && <p className="alert-error">{error}</p>}
        <button type="submit" className="btn-primary">
          Salvar
        </button>
      </form>
    </main>
  );
}
