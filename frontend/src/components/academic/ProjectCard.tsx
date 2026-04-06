import { ExternalLink } from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { AcademicProject } from "@/data/academic";

export function ProjectCard({ project }: { project: AcademicProject }) {
  return (
    <HUDCard className="group">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-jarvis-text text-sm">
          {project.title}
        </h4>
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-jarvis-muted hover:text-jarvis-cyan transition-colors"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
      <p className="text-jarvis-muted text-xs leading-relaxed mb-3">
        {project.description}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {project.tech.map((t) => (
          <span
            key={t}
            className="px-2 py-0.5 text-[10px] font-mono rounded bg-jarvis-cyan/10 text-jarvis-cyan border border-jarvis-cyan/20"
          >
            {t}
          </span>
        ))}
      </div>
    </HUDCard>
  );
}
