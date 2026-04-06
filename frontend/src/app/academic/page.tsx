import { SectionLabel } from "@/components/ui/SectionLabel";
import { SkillsGrid } from "@/components/academic/SkillsGrid";
import { EducationCard } from "@/components/academic/EducationCard";
import { ProjectCard } from "@/components/academic/ProjectCard";
import { ResumeDownload } from "@/components/academic/ResumeDownload";
import { skillCategories, education, academicProjects } from "@/data/academic";

export default function AcademicPage() {
  return (
    <div className="space-y-12">
      <section>
        <SectionLabel label="Skills" />
        <SkillsGrid categories={skillCategories} />
      </section>

      <section>
        <SectionLabel label="Education" />
        <div className="space-y-4">
          {education.map((edu, i) => (
            <EducationCard key={i} edu={edu} />
          ))}
        </div>
      </section>

      <section>
        <SectionLabel label="Projects" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {academicProjects.map((project, i) => (
            <ProjectCard key={i} project={project} />
          ))}
        </div>
      </section>

      <section>
        <SectionLabel label="Resume" />
        <ResumeDownload />
      </section>
    </div>
  );
}
