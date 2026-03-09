import { GithubProfile, GithubRepo } from "./types";

export async function fetchGithubData(): Promise<{
  profile: GithubProfile;
  repos: GithubRepo[];
}> {
  // Fetch directly from the public GitHub API so it works statically without a backend 
  const [profileRes, reposRes] = await Promise.all([
    fetch("https://api.github.com/users/Anurg29"),
    fetch("https://api.github.com/users/Anurg29/repos?sort=updated&per_page=12")
  ]);

  if (!profileRes.ok || !reposRes.ok) {
    throw new Error("Failed to fetch GitHub data");
  }

  const profile = await profileRes.json();
  const repos = await reposRes.json();

  return { profile, repos };
}
