"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [deadline, setDeadline] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, goal, deadline }),
    });

    if (res.ok) {
      const data = await res.json();
      router.push(`/campaigns/${data.id}`);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao criar campanha.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-[500px] flex-1 px-5 py-9">
      <header className="mb-6">
        <h1 className="font-display text-[28px] font-semibold text-ink">Nova campanha</h1>
        <p className="text-muted">Conte uma história que merece ser ajudada.</p>
      </header>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-[28px_26px]">
        <div>
          <label className="label">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="field"
          />
        </div>
        <div>
          <label className="label">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="field resize-y leading-relaxed"
          />
        </div>
        <div className="flex flex-wrap gap-[14px]">
          <div className="flex-1">
            <label className="label">Meta (R$)</label>
            <input
              type="number"
              min="1"
              step="0.01"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
              className="field"
            />
          </div>
          <div className="flex-1">
            <label className="label">Prazo (opcional)</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="field"
            />
          </div>
        </div>
        {error && <p className="alert-error">{error}</p>}
        <button type="submit" className="btn-primary">
          Criar campanha
        </button>
      </form>
    </main>
  );
}
