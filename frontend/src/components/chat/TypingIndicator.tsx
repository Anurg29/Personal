export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-2">
      <span className="font-mono text-[10px] text-jarvis-cyan/40 tracking-widest uppercase mr-2">
        J.A.R.V.I.S.
      </span>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-jarvis-cyan/60 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
