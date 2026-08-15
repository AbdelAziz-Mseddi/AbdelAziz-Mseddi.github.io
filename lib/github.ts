export const GITHUB_USERNAME = "AbdelAziz-Mseddi";

export type GithubStats = {
  publicRepos: number;
  followers: number;
  following: number;
  createdAt: string;
  topLanguages: { name: string; count: number }[];
};

const FALLBACK: GithubStats = {
  publicRepos: 15,
  followers: 16,
  following: 28,
  createdAt: "2022-03-27",
  topLanguages: [
    { name: "Python", count: 3 },
    { name: "Java", count: 3 },
    { name: "TypeScript", count: 2 },
    { name: "C++", count: 2 },
  ],
};

export async function getGithubStats(): Promise<GithubStats> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`,
        {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 3600 },
        }
      ),
    ]);

    if (!userRes.ok || !reposRes.ok) return FALLBACK;

    const user = await userRes.json();
    const repos: { language: string | null; fork: boolean }[] =
      await reposRes.json();

    const langCounts = new Map<string, number>();
    for (const repo of repos) {
      if (repo.fork || !repo.language) continue;
      langCounts.set(repo.language, (langCounts.get(repo.language) ?? 0) + 1);
    }
    const topLanguages = [...langCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    return {
      publicRepos: user.public_repos ?? FALLBACK.publicRepos,
      followers: user.followers ?? FALLBACK.followers,
      following: user.following ?? FALLBACK.following,
      createdAt: user.created_at ?? FALLBACK.createdAt,
      topLanguages: topLanguages.length ? topLanguages : FALLBACK.topLanguages,
    };
  } catch {
    return FALLBACK;
  }
}
