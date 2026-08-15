const SYNODIC_MONTH_DAYS = 29.53058867;
// A known new moon reference instant (2000-01-06 18:14 UTC).
const REFERENCE_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);

export type MoonPhase = {
  /** 0 = new moon, 0.5 = full moon, wraps at 1. */
  fraction: number;
  name: string;
};

const PHASE_NAMES = [
  "New Moon",
  "Waxing Crescent",
  "First Quarter",
  "Waxing Gibbous",
  "Full Moon",
  "Waning Gibbous",
  "Last Quarter",
  "Waning Crescent",
];

export function getMoonPhase(date: Date): MoonPhase {
  const daysSinceReference = (date.getTime() - REFERENCE_NEW_MOON_MS) / 86_400_000;
  const fraction =
    ((daysSinceReference % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) %
    SYNODIC_MONTH_DAYS /
    SYNODIC_MONTH_DAYS;
  const name = PHASE_NAMES[Math.round(fraction * 8) % 8];
  return { fraction, name };
}

// Tabular ("Kuwaiti algorithm") Gregorian → Hijri conversion — a standard
// public arithmetic approximation, not tied to a specific moon sighting
// authority. Good enough for a decorative palette shift, not for religious
// observance.
function gregorianToJulianDay(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const y2 = y + 4800 - a;
  const m2 = m + 12 * a - 3;
  return (
    d +
    Math.floor((153 * m2 + 2) / 5) +
    365 * y2 +
    Math.floor(y2 / 4) -
    Math.floor(y2 / 100) +
    Math.floor(y2 / 400) -
    32045
  );
}

function julianDayToHijriMonth(jdInput: number): number {
  let jd = jdInput - 1948440 + 10632;
  const n = Math.floor((jd - 1) / 10631);
  jd = jd - 10631 * n + 354;
  const j =
    Math.floor((10985 - jd) / 5316) * Math.floor((50 * jd) / 17719) +
    Math.floor(jd / 5670) * Math.floor((43 * jd) / 15238);
  jd =
    jd -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  return Math.floor((24 * jd) / 709);
}

export function isRamadan(date: Date): boolean {
  const jd = gregorianToJulianDay(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate()
  );
  return julianDayToHijriMonth(jd) === 9;
}
