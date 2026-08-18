import { Reveal } from "@/components/Reveal";
import { GithubActivity } from "@/components/GithubActivity";
import { getGithubStats, GITHUB_USERNAME } from "@/lib/github";

export async function GithubStats() {
  const stats = await getGithubStats();
  const since = new Date(stats.createdAt).getFullYear();

  const tiles = [
    { label: "Public repos", value: stats.publicRepos },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
    { label: "On GitHub since", value: since },
  ];

  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal className="rounded-2xl border border-border bg-background-alt/60 p-6 sm:p-8">
          <div className="flex items-baseline justify-between gap-4">
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="font-display text-3xl uppercase text-foreground hover:text-accent-bright"
            >
              @{GITHUB_USERNAME}
            </a>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dim">
              {"// live from GitHub"}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
            {tiles.map((tile) => (
              <div key={tile.label} className="bg-background-alt p-5">
                <p className="font-display text-2xl text-foreground sm:text-3xl">
                  {tile.value}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-muted-dim">
                  {tile.label}
                </p>
              </div>
            ))}
          </div>

          <GithubActivity />
        </Reveal>
      </div>
    </section>
  );
}
