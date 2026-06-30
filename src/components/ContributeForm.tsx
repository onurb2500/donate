"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function ContributeForm({ campaignId }: { campaignId: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/campaigns/${campaignId}/contribute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    });

    if (res.ok) {
      setAmount("");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao contribuir.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-start gap-3">
      <div className="relative flex-1 min-w-[140px]">
        <span className="pointer-events-none absolute left-[15px] top-1/2 -translate-y-1/2 text-muted">
          R$
        </span>
        <input
          type="number"
          min="1"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="field field-olive-focus pl-9"
        />
      </div>
      <button type="submit" className="btn-olive">
        Contribuir
      </button>
      {error && <p className="alert-error w-full">{error}</p>}
    </form>
  );
}
