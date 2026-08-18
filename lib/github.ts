import contributionSnapshot from "@/content/github-contributions.json";

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

export type GithubContributions = {
  /** Total contributions in the trailing year (private included when the
   *  build token can see them; public-only otherwise). */
  total: number;
  commits: number;
  pullRequests: number;
  reviews: number;
  issues: number;
  /** Contributions made to private repos the token can see. */
  privateContributions: number;
  /** Repos created in the window. */
  reposCreated: number;
  /** Distinct repos this person pushed commits to in the window. */
  reposWithCommits: number;
  /** True when these numbers came from an authenticated build-time fetch (so
   *  they include private-repo contributions), false when we fell back to the
   *  committed public-only snapshot. Drives the "public + private" vs
   *  "public only" scope label. (restrictedContributionsCount is NOT a usable
   *  signal here: it counts only contributions to repos the viewer cannot see,
   *  so it is ~0 for the owner's own token even when private work is included.) */
  authed: boolean;
  /** 53 columns, each a Sun..Sat array of daily counts; -1 = day outside the
   *  window (the ragged first/last week). Kept for deriving streaks / busiest
   *  day / active-day stats, not for drawing a calendar. */
  weeks: number[][];
  startDate: string;
  endDate: string;
};

/**
 * The contribution calendar shown on the profile page. It comes from the
 * GraphQL API, which (unlike the REST endpoints above) requires a token.
 *
 * The trailing-year count only includes PRIVATE contributions (the org work
 * behind the real 905) when the token is a personal access token that has been
 * SAML-authorized for that org. In CI that means the GH_STATS_TOKEN secret;
 * the workflow-default GITHUB_TOKEN and an unauthorized token both see the
 * smaller public-only number.
 * (GitHub reserves the GITHUB_ prefix for secret names, so the secret cannot
 * itself be called GITHUB_STATS_TOKEN.)
 *
 * With no usable token, or on any failure, we fall back to the committed
 * snapshot in content/github-contributions.json so the build is never broken
 * and the section always renders a real-shaped calendar.
 */
export async function getGithubContributions(): Promise<GithubContributions> {
  // The committed snapshot holds only public data, so its scope is "public".
  const snapshot: GithubContributions = {
    ...(contributionSnapshot as Omit<GithubContributions, "authed">),
    authed: false,
  };

  const token = process.env.GH_STATS_TOKEN || process.env.GITHUB_TOKEN;
  if (!token) return snapshot;

  const query = `
    query($login:String!){
      user(login:$login){
        contributionsCollection{
          totalCommitContributions
          totalPullRequestContributions
          totalPullRequestReviewContributions
          totalIssueContributions
          restrictedContributionsCount
          totalRepositoryContributions
          totalRepositoriesWithContributedCommits
          contributionCalendar{
            totalContributions
            weeks{ contributionDays{ contributionCount weekday date } }
          }
        }
      }
    }`;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) return snapshot;

    const json = await res.json();
    const c = json?.data?.user?.contributionsCollection;
    const cal = c?.contributionCalendar;
    if (!cal?.weeks?.length) return snapshot;

    type Day = { contributionCount: number; weekday: number; date: string };
    type Week = { contributionDays: Day[] };
    const weeks: number[][] = (cal.weeks as Week[]).map((w) => {
      const col = [-1, -1, -1, -1, -1, -1, -1];
      for (const day of w.contributionDays) col[day.weekday] = day.contributionCount;
      return col;
    });
    const flat = cal.weeks.flatMap((w: Week) => w.contributionDays);

    return {
      total: cal.totalContributions,
      commits: c.totalCommitContributions,
      pullRequests: c.totalPullRequestContributions,
      reviews: c.totalPullRequestReviewContributions,
      issues: c.totalIssueContributions,
      privateContributions: c.restrictedContributionsCount ?? 0,
      reposCreated: c.totalRepositoryContributions ?? 0,
      reposWithCommits: c.totalRepositoriesWithContributedCommits ?? 0,
      authed: true,
      weeks,
      startDate: flat[0]?.date ?? contributionSnapshot.startDate,
      endDate: flat[flat.length - 1]?.date ?? contributionSnapshot.endDate,
    };
  } catch {
    return snapshot;
  }
}
