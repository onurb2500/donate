import Link from "next/link";
import { notFound } from "next/navigation";
import { db, dbReady } from "@/lib/db";
import ContributeForm from "@/components/ContributeForm";
import Avatar from "@/components/Avatar";
import Progress from "@/components/Progress";

function formatBRL(cents: number) {
  return "R$ " + Math.round(cents / 100).toLocaleString("pt-BR");
}

export default async function CampaignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    notFound();
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

  const goal = Number(campaign.goal_cents);
  const raised = Number(campaign.raised_cents);
  const pct = Math.min(100, Math.round((raised / goal) * 100));

  return (
    <main className="mx-auto w-full max-w-[680px] flex-1 px-5 py-9">
      <Link href="/" className="text-sm text-muted transition hover:text-terracotta">
        ← Todas as campanhas
      </Link>

      <div className="card mt-4 p-[30px_28px] shadow-hero">
        <h1 className="font-display text-[28px] font-semibold text-ink">
          {String(campaign.title)}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <Avatar name={String(campaign.owner_name)} size={36} />
          <span className="text-body">
            por <span className="font-bold">{String(campaign.owner_name)}</span>
          </span>
        </div>

        <div className="mt-4 text-[16px] leading-[1.7] text-body">
          {String(campaign.description)
            .split("\n")
            .map((paragraph, i) => (
              <p key={i} className="mb-[13px] last:mb-0">
                {paragraph}
              </p>
            ))}
        </div>

        <div className="mt-5 rounded-[18px] border border-line-nav bg-cream p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="font-display text-[30px] font-semibold text-terracotta">
              {formatBRL(raised)}
            </span>
            {pct >= 100 && <span className="badge-meta">Meta alcançada ♥</span>}
          </div>
          <p className="mb-3 text-muted">
            arrecadados de {formatBRL(goal)} · {pct}%
          </p>
          <Progress raised={raised} goal={goal} strong />
        </div>
      </div>

      <div className="card mt-[18px] p-[26px_28px]">
        <h2 className="font-display text-xl font-semibold text-ink">
          Faça sua contribuição
        </h2>
        <p className="mb-4 text-muted">Toda contribuição vira esperança para alguém.</p>
        <ContributeForm campaignId={String(campaign.id)} />
      </div>

      <div className="card mt-[18px] p-[26px_28px]">
        <h2 className="mb-3 font-display text-xl font-semibold text-ink">Contribuintes</h2>
        {contributionsResult.rows.length === 0 ? (
          <p className="text-muted">Ninguém contribuiu ainda. Seja a primeira pessoa a ajudar ♥</p>
        ) : (
          <ul>
            {contributionsResult.rows.map((c, i) => (
              <li
                key={i}
                className="flex items-center gap-3 border-b border-[#F5EEE4] py-[10px] last:border-b-0"
              >
                <Avatar name={String(c.contributor_name)} index={i} size={38} />
                <span className="flex-1 font-bold text-body">
                  {String(c.contributor_name)}
                </span>
                <span className="font-extrabold text-olive">
                  {formatBRL(Number(c.amount_cents))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
