"use client";

import { useEffect, useState } from "react";
import { ProfileCard } from "@/components/github/ProfileCard";
import { RepoGrid } from "@/components/github/RepoGrid";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { fetchGithubData } from "@/lib/github";
import { GithubProfile, GithubRepo } from "@/lib/types";
import { Loader2 } from "lucide-react";

export default function GitHubPage() {
  const [profile, setProfile] = useState<GithubProfile | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGithubData();
        setProfile(data.profile);
        setRepos(data.repos);
      } catch {
        setError("Failed to load GitHub data. Check your network or GitHub API limits.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-jarvis-cyan animate-spin" />
        <span className="ml-3 font-mono text-jarvis-muted text-sm">
          Fetching GitHub data...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="font-mono text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionLabel label="GitHub Portfolio" />
      {profile && <ProfileCard profile={profile} />}
      <div className="mt-8">
        <h3 className="font-mono text-jarvis-cyan/60 text-xs tracking-widest uppercase mb-4">
          // Repositories
        </h3>
        <RepoGrid repos={repos} />
      </div>
    </div>
  );
}
