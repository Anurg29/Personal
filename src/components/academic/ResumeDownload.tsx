import { Download } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";

export function ResumeDownload() {
  return (
    <a href="/resume.pdf" download>
      <GlowButton className="inline-flex items-center gap-2">
        <Download size={16} />
        Download Resume
      </GlowButton>
    </a>
  );
}
