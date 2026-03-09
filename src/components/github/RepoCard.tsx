import { Star, GitFork, ExternalLink } from "lucide-react";
import { HUDCard } from "@/components/ui/HUDCard";
import { GithubRepo } from "@/lib/types";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  C: "#555555",
  "C++": "#f34b7d",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Dart: "#00B4AB",
};

export function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="block group">
      <HUDCard className="h-full flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-mono text-sm font-semibold text-jarvis-cyan group-hover:text-jarvis-cyan/80 transition-colors truncate pr-2">
            {repo.name}
          </h3>
          <ExternalLink
            size={14}
            className="text-jarvis-muted shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <p className="text-jarvis-muted text-xs leading-relaxed flex-1 mb-4 line-clamp-2">
          {repo.description || "No description"}
        </p>

        <div className="flex items-center gap-4 text-xs">
          {repo.language && (
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  backgroundColor: languageColors[repo.language] || "#8b949e",
                }}
              />
              <span className="text-jarvis-muted">{repo.language}</span>
            </div>
          )}
          {repo.stargazers_count > 0 && (
            <div className="flex items-center gap-1 text-jarvis-muted">
              <Star size={12} />
              <span>{repo.stargazers_count}</span>
            </div>
          )}
          {repo.forks_count > 0 && (
            <div className="flex items-center gap-1 text-jarvis-muted">
              <GitFork size={12} />
              <span>{repo.forks_count}</span>
            </div>
          )}
        </div>
      </HUDCard>
    </a>
  );
}
