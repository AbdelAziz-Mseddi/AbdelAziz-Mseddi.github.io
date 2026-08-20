import { getGithubContributions, type GithubContributions } from "@/lib/github";
import {
  GithubActivityPanel,
  type Tile,
  type Segment,
} from "@/components/GithubActivityPanel";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Flatten the ragged week grid into a chronological run of in-range days.
 *  In-range days are contiguous calendar days from startDate onward, so the
 *  date of the nth in-range day is simply startDate + n. */
function daily(c: GithubContributions): { count: number; date: Date }[] {
  const start = new Date(c.startDate + "T00:00:00Z");
  const out: { count: number; date: Date }[] = [];
  let i = 0;
  for (const week of c.weeks) {
    for (const v of week) {
      if (v < 0) continue;
      const d = new Date(start);
      d.setUTCDate(d.getUTCDate() + i);
      out.push({ count: v, date: d });
      i++;
    }
  }
  return out;
}

function derive(c: GithubContributions) {
  const days = daily(c);

  let longest = 0;
  let run = 0;
  for (const d of days) {
    run = d.count > 0 ? run + 1 : 0;
    if (run > longest) longest = run;
  }

  // Current streak: consecutive active days ending today. The calendar always
  // includes today as its final day, and today is often still empty (the UTC
  // day is young, or the API's per-day count lags the live profile). Treat
  // today as "not over yet": a trailing zero on the final day does not reset
  // the streak, so in that case count back from yesterday. This matches how
  // GitHub's own streak counters behave.
  let current = 0;
  let ci = days.length - 1;
  if (ci >= 0 && days[ci].count === 0) ci--;
  for (; ci >= 0 && days[ci].count > 0; ci--) current++;

  let busiest = days[0] ?? { count: 0, date: new Date() };
  for (const d of days) if (d.count > busiest.count) busiest = d;

  const activeDays = days.filter((d) => d.count > 0).length;

  const byMonth = new Map<string, number>();
  for (const d of days) {
    const key = `${d.date.getUTCFullYear()}-${d.date.getUTCMonth()}`;
    byMonth.set(key, (byMonth.get(key) ?? 0) + d.count);
  }
  let topMonthKey = "";
  let topMonthVal = 0;
  for (const [k, v] of byMonth) if (v > topMonthVal) { topMonthVal = v; topMonthKey = k; }
  const topMonth = topMonthKey
    ? MONTHS[Number(topMonthKey.split("-")[1])]
    : "";

  return { longest, current, busiest, activeDays, topMonth, topMonthVal };
}

function fmtDate(d: Date): string {
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

// Split colours drawn from the site's accent family so the donut reads as
// part of the palette, not a generic chart.
const SPLIT = [
  { key: "commits", label: "Commits", color: "#d9a066" },
  { key: "pullRequests", label: "Pull requests", color: "#9db8e8" },
  { key: "reviews", label: "Code review", color: "#e8623d" },
  { key: "issues", label: "Issues", color: "#5b6178" },
] as const;

function splitSegments(c: GithubContributions): Segment[] {
  const rows = SPLIT.map((s) => ({ ...s, value: c[s.key] as number })).filter(
    (r) => r.value > 0
  );
  const sum = rows.reduce((a, r) => a + r.value, 0) || 1;
  return rows
    .map((r) => ({
      key: r.key,
      label: r.label,
      color: r.color,
      pct: Math.round((r.value / sum) * 100),
      frac: r.value / sum,
    }))
    .sort((a, b) => b.frac - a.frac);
}

export async function GithubActivity() {
  const c = await getGithubContributions();
  const d = derive(c);

  // Curated set: always show the core counts; drop the optional ones when
  // they'd just read as a wall of zeros.
  const tiles: Tile[] = [
    { value: c.commits.toLocaleString(), label: "Commits" },
    { value: c.pullRequests.toLocaleString(), label: "Pull requests" },
  ];
  if (c.reviews > 0)
    tiles.push({ value: c.reviews.toLocaleString(), label: "Code reviews" });
  if (c.issues > 0)
    tiles.push({ value: c.issues.toLocaleString(), label: "Issues opened" });
  tiles.push({ value: c.reposWithCommits.toLocaleString(), label: "Repos touched" });
  if (c.reposCreated > 0)
    tiles.push({ value: c.reposCreated.toLocaleString(), label: "Repos created" });
  tiles.push({
    value: String(d.longest),
    label: "Longest streak",
    caption: d.longest === 1 ? "day" : "days",
  });
  tiles.push({
    value: String(d.current),
    label: "Current streak",
    caption: d.current === 1 ? "day" : "days",
  });
  tiles.push({ value: String(d.activeDays), label: "Active days" });
  if (d.activeDays > 0)
    tiles.push({
      value: (c.total / d.activeDays).toFixed(1),
      label: "Avg / active day",
    });
  tiles.push({
    value: String(d.busiest.count),
    label: "Busiest day",
    caption: d.busiest.count > 0 ? fmtDate(d.busiest.date) : undefined,
  });
  if (d.topMonth)
    tiles.push({
      value: d.topMonth,
      label: "Busiest month",
      caption: `${d.topMonthVal} contributions`,
    });

  return (
    <GithubActivityPanel
      total={c.total}
      tiles={tiles}
      segments={splitSegments(c)}
      includesPrivate={c.authed}
    />
  );
}
