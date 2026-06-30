import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, dbReady } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Preencha e-mail, senha e nome." },
      { status: 400 },
    );
  }

  await dbReady;

  const existing = await db.execute({
    sql: "SELECT id FROM users WHERE email = ?",
    args: [email],
  });
  if (existing.rows.length > 0) {
    return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await db.execute({
    sql: "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    args: [email, passwordHash, name],
  });

  const session = await getSession();
  session.userId = Number(result.lastInsertRowid);
  session.name = name;
  await session.save();

  return NextResponse.json({ ok: true });
}
