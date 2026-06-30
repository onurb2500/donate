const PALETTE = ["#D98B6F", "#E8B04B", "#7A8B5A", "#B07BA0"];

export default function Avatar({
  name,
  index = 0,
  size = 42,
}: {
  name?: string;
  index?: number;
  size?: number;
}) {
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.38,
    background: PALETTE[index % PALETTE.length],
  };

  return (
    <span
      className="flex items-center justify-center rounded-avatar text-white font-extrabold shrink-0"
      style={style}
    >
      {(name ?? "?").trim().charAt(0).toUpperCase()}
    </span>
  );
}
