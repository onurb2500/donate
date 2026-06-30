import Link from "next/link";
import Avatar from "./Avatar";
import LogoutButton from "./LogoutButton";

export default function Nav({ name }: { name?: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line-nav bg-[rgba(255,251,245,.88)] backdrop-blur">
      <nav className="flex flex-wrap items-center gap-4 px-[22px] py-[13px]">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-field bg-terracotta/16 text-terracotta">
            ♥
          </span>
          <span className="font-display text-xl font-semibold text-ink">Vaquinha</span>
        </Link>

        <div className="flex-1" />

        <Link
          href="/campaigns/new"
          className="text-[15px] font-bold text-body transition hover:text-terracotta"
        >
          Nova campanha
        </Link>
        <Link
          href="/profile"
          className="text-[15px] font-bold text-body transition hover:text-terracotta"
        >
          Meu cadastro
        </Link>

        <span className="flex items-center gap-2 rounded-full border border-line-nav bg-cream px-3 py-1">
          <Avatar name={name} size={26} />
          <span className="text-sm font-bold text-body">{name}</span>
        </span>

        <LogoutButton />
      </nav>
    </header>
  );
}
