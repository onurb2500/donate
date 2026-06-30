import { NextResponse } from "next/server";
import { db, dbReady } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await dbReady;

  const campaignResult = await db.execute({
    sql: `
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
      WHERE campaigns.id = ?
      GROUP BY campaigns.id
    `,
    args: [id],
  });

  const campaign = campaignResult.rows[0];
  if (!campaign) {
    return NextResponse.json({ error: "Campanha não encontrada." }, { status: 404 });
  }

  const contributionsResult = await db.execute({
    sql: `
      SELECT contributions.amount_cents, contributions.created_at, users.name AS contributor_name
      FROM contributions
      JOIN users ON users.id = contributions.user_id
      WHERE contributions.campaign_id = ?
      ORDER BY contributions.created_at DESC
    `,
    args: [id],
  });

  return NextResponse.json({
    campaign,
    contributions: contributionsResult.rows,
  });
}
