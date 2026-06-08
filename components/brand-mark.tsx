import Image from "next/image";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="relative size-12 overflow-hidden rounded-full border border-[#D4AF37]/55 bg-[#111111] shadow-[0_0_32px_rgba(212,175,55,0.24)]">
        <Image
          src="/brand/wedify-logo.jpeg"
          alt="Wedify logo"
          fill
          priority
          sizes="48px"
          className="object-cover"
        />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-lg font-semibold tracking-[0.18em] text-white">WEDIFY</span>
          <span className="block pt-1 text-[10px] uppercase tracking-[0.32em] text-[#D4AF37]">
            The Royal Invite
          </span>
        </span>
      )}
    </div>
  );
}
