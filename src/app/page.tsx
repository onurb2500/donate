import Link from "next/link";
import { db, dbReady } from "@/lib/db";
import Avatar from "@/components/Avatar";
import Progress from "@/components/Progress";

function formatBRL(cents: number) {
  return "R$ " + Math.round(cents / 100).toLocaleString("pt-BR");
}

export default async function DashboardPage() {
  await dbReady;

  const result = await db.execute(`
    SELECT
      campaigns.id,
      campaigns.title,
      campaigns.goal_cents,
      users.name AS owner_name,
      COALESCE(SUM(contributions.amount_cents), 0) AS raised_cents
    FROM campaigns
    JOIN users ON users.id = campaigns.owner_id
    LEFT JOIN contributions ON contributions.campaign_id = campaigns.id
    GROUP BY campaigns.id
    ORDER BY campaigns.created_at DESC
  `);

  const campaigns = result.rows;

  return (
    <main className="mx-auto w-full max-w-[800px] flex-1 px-5 pt-9 pb-[70px]">
      <header className="mb-7">
        <h1 className="font-display text-[34px] font-semibold text-ink">Campanhas</h1>
        <p className="text-muted">Histórias da nossa comunidade que precisam de você.</p>
      </header>

      {campaigns.length === 0 && (
        <p className="text-center text-muted">Nenhuma campanha ainda.</p>
      )}

      <ul
        className="grid gap-[18px]"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(330px, 1fr))" }}
      >
        {campaigns.map((c, i) => {
          const goal = Number(c.goal_cents);
          const raised = Number(c.raised_cents);
          const pct = Math.min(100, Math.round((raised / goal) * 100));
          return (
            <li
              key={String(c.id)}
              className="card flex flex-col gap-[15px] p-[22px] transition hover:-translate-y-[3px] hover:shadow-card-hover"
            >
              <div className="flex items-start gap-3">
                <Avatar name={String(c.owner_name)} index={i} />
                <div className="flex-1">
                  <Link
                    href={`/campaigns/${c.id}`}
                    className="font-display text-lg font-medium text-ink transition hover:text-terracotta"
                  >
                    {String(c.title)}
                  </Link>
                  <p className="text-sm text-muted">por {String(c.owner_name)}</p>
                </div>
                {pct >= 100 && <span className="badge-meta">Meta alcançada</span>}
              </div>

              <Progress raised={raised} goal={goal} />

              <div className="flex items-baseline justify-between">
                <span className="text-[17px] font-extrabold text-ink">
                  {formatBRL(raised)}
                </span>
                <span className="text-sm font-bold text-muted">
                  de {formatBRL(goal)} · {pct}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
