export type ArchiveEntry = {
  id: string;
  year: string;
  tier: string;
  title: string;
  translation: string;
  subtitle: string;
  blurb: string;
  href: string;
};

/**
 * Course-note collections built for the students coming up behind me at INSAT.
 * These are Google Drive folders shared read-only; the descriptions are
 * deliberately generic; verify and refine them against what each drive
 * actually contains.
 */
export const ARCHIVE: ArchiveEntry[] = [
  {
    id: "mpi",
    year: "2024 / 2025",
    tier: "First year",
    title: "Maths · Physique · Informatique",
    translation: "Maths, Physics & Computer Science",
    subtitle: "MPI",
    blurb:
      "The first-year core, gathered and organized by module: analysis and algebra, physics, and the first programming courses.",
    href: "https://drive.google.com/drive/folders/16Wv5qSuBTX_ZW9IpCWvWk9tTC03zV1h5",
  },
  {
    id: "gl",
    year: "2025 / 2026",
    tier: "Second year",
    title: "Génie Logiciel",
    translation: "Software Engineering",
    subtitle: "GL",
    blurb:
      "The software-engineering year: course notes, TDs, and exam prep, kept as I worked through them.",
    href: "https://drive.google.com/drive/folders/1NyRPEBE2nU_eAM1kknRs1qZyYS0Kc08a",
  },
];
