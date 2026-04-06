import { GithubRepo } from "@/lib/types";
import { RepoCard } from "./RepoCard";

export function RepoGrid({ repos }: { repos: GithubRepo[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {repos.map((repo) => (
        <RepoCard key={repo.id} repo={repo} />
      ))}
    </div>
  );
}
