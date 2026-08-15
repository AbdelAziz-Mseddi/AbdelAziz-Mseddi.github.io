import { Reveal } from "@/components/Reveal";
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
        <Reveal className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-dim">
              {"// Live from GitHub"}
            </p>
            <a
              href={`https://github.com/${GITHUB_USERNAME}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block font-display text-3xl uppercase text-foreground hover:text-accent-bright"
            >
              @{GITHUB_USERNAME}
            </a>
          </div>

          {stats.topLanguages.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {stats.topLanguages.map((lang) => (
                <span
                  key={lang.name}
                  className="rounded-full border border-border-strong px-3 py-1 text-xs text-muted"
                >
                  {lang.name}
                </span>
              ))}
            </div>
          )}
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
          {tiles.map((tile) => (
            <div key={tile.label} className="bg-background-alt p-6">
              <p className="font-display text-3xl text-foreground">
                {tile.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-muted-dim">
                {tile.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
