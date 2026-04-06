import { GraduationCap, Calendar } from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { Education } from "@/data/academic";

export function EducationCard({ edu }: { edu: Education }) {
  return (
    <HUDCard>
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-lg bg-jarvis-cyan/10 flex items-center justify-center">
          <GraduationCap size={20} className="text-jarvis-cyan" />
        </div>
        <div>
          <h4 className="font-semibold text-jarvis-text text-sm">
            {edu.degree}
          </h4>
          <p className="text-jarvis-cyan text-sm mt-0.5">{edu.institution}</p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-jarvis-muted">
            <Calendar size={12} />
            <span>{edu.period}</span>
          </div>
          {edu.description && (
            <p className="text-jarvis-muted text-xs mt-2 leading-relaxed">
              {edu.description}
            </p>
          )}
        </div>
      </div>
    </HUDCard>
  );
}
