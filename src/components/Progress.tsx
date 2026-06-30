export default function Progress({
  raised,
  goal,
  strong = false,
}: {
  raised: number;
  goal: number;
  strong?: boolean;
}) {
  const pct = Math.round((raised / goal) * 100);
  const reached = pct >= 100;

  return (
    <div
      className={`${strong ? "h-[13px] bg-track-strong" : "h-[10px] bg-track"} rounded-full overflow-hidden`}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: Math.min(100, pct) + "%",
          background: reached
            ? "linear-gradient(90deg,#7A8B5A,#E8B04B)"
            : "linear-gradient(90deg,#D98B6F,#E8B04B)",
        }}
      />
    </div>
  );
}
