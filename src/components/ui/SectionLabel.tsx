import { cn } from "@/lib/utils";

interface SectionLabelProps {
  label: string;
  className?: string;
}

export function SectionLabel({ label, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3 mb-8", className)}>
      <span className="text-jarvis-cyan font-mono text-sm tracking-widest uppercase">
        // {label}
      </span>
      <div className="flex-1 h-px bg-gradient-to-r from-jarvis-cyan/30 to-transparent" />
    </div>
  );
}
