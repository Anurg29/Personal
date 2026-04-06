import { HUDCard } from "@/components/ui/HUDCard";
import { SkillCategory } from "@/data/academic";

export function SkillsGrid({ categories }: { categories: SkillCategory[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <HUDCard key={category.title}>
          <h4 className="font-mono text-jarvis-cyan text-xs tracking-widest uppercase mb-4">
            {category.title}
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.skills.map((skill) => (
              <span
                key={skill.name}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-jarvis-elevated border border-jarvis-border text-jarvis-text hover:border-jarvis-cyan/40 hover:text-jarvis-cyan transition-all duration-200"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </HUDCard>
      ))}
    </div>
  );
}
