export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-dim sm:flex-row sm:px-10">
        <p>© {new Date().getFullYear()} Abdelaziz Mseddi.</p>
        <p>Built at night, in winter.</p>
      </div>
    </footer>
  );
}
