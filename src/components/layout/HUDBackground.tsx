export function HUDBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 212, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Scanline */}
      <div className="absolute left-0 right-0 h-px bg-jarvis-cyan/20 animate-scanline" />

      {/* Top-left corner decoration */}
      <svg
        className="absolute top-20 left-4 w-16 h-16 text-jarvis-cyan/10"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M0 20 L0 0 L20 0" />
        <circle cx="0" cy="0" r="3" fill="currentColor" />
      </svg>

      {/* Bottom-right corner decoration */}
      <svg
        className="absolute bottom-4 right-4 w-16 h-16 text-jarvis-cyan/10"
        viewBox="0 0 64 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <path d="M64 44 L64 64 L44 64" />
        <circle cx="64" cy="64" r="3" fill="currentColor" />
      </svg>

      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-radial-[circle_at_50%_50%] from-jarvis-cyan/[0.02] to-transparent" />
    </div>
  );
}
