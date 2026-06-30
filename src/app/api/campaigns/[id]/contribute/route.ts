import { NextResponse } from "next/server";
import { db, dbReady } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { id } = await params;
  const { amount } = await request.json();
  const amountCents = Math.round(Number(amount) * 100);

  if (!amountCents || amountCents <= 0) {
    return NextResponse.json({ error: "Informe um valor válido." }, { status: 400 });
  }

  await dbReady;
  await db.execute({
    sql: "INSERT INTO contributions (campaign_id, user_id, amount_cents) VALUES (?, ?, ?)",
    args: [id, session.userId, amountCents],
  });

  return NextResponse.json({ ok: true });
}
