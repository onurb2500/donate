import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db, dbReady } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Preencha e-mail e senha." },
      { status: 400 },
    );
  }

  await dbReady;

  const result = await db.execute({
    sql: "SELECT id, password_hash, name FROM users WHERE email = ?",
    args: [email],
  });
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash as string))) {
    return NextResponse.json({ error: "Credenciais inválidas." }, { status: 401 });
  }

  const session = await getSession();
  session.userId = Number(user.id);
  session.name = user.name as string;
  await session.save();

  return NextResponse.json({ ok: true });
}
