import { GithubProfile, GithubRepo } from "./types";

export async function fetchGithubData(): Promise<{
  profile: GithubProfile;
  repos: GithubRepo[];
}> {
  const res = await fetch("/api/github");
  if (!res.ok) throw new Error("Failed to fetch GitHub data");
  return res.json();
}
