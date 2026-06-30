import { NextResponse } from "next/server";
import { db, dbReady } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  await dbReady;

  const result = await db.execute(`
    SELECT
      campaigns.id,
      campaigns.title,
      campaigns.description,
      campaigns.goal_cents,
      campaigns.deadline,
      users.name AS owner_name,
      COALESCE(SUM(contributions.amount_cents), 0) AS raised_cents
    FROM campaigns
    JOIN users ON users.id = campaigns.owner_id
    LEFT JOIN contributions ON contributions.campaign_id = campaigns.id
    GROUP BY campaigns.id
    ORDER BY campaigns.created_at DESC
  `);

  return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { title, description, goal, deadline } = await request.json();
  const goalCents = Math.round(Number(goal) * 100);

  if (!title || !description || !goalCents || goalCents <= 0) {
    return NextResponse.json(
      { error: "Preencha título, descrição e uma meta válida." },
      { status: 400 },
    );
  }

  await dbReady;
  const result = await db.execute({
    sql: "INSERT INTO campaigns (owner_id, title, description, goal_cents, deadline) VALUES (?, ?, ?, ?, ?)",
    args: [session.userId, title, description, goalCents, deadline || null],
  });

  return NextResponse.json({ ok: true, id: Number(result.lastInsertRowid) });
}
