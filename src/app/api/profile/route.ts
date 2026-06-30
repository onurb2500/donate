import { NextResponse } from "next/server";
import { db, dbReady } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await dbReady;
  const result = await db.execute({
    sql: "SELECT id, email, name FROM users WHERE id = ?",
    args: [session.userId],
  });

  return NextResponse.json(result.rows[0]);
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { name } = await request.json();
  if (!name) {
    return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });
  }

  await dbReady;
  await db.execute({
    sql: "UPDATE users SET name = ? WHERE id = ?",
    args: [name, session.userId],
  });

  session.name = name;
  await session.save();

  return NextResponse.json({ ok: true });
}
