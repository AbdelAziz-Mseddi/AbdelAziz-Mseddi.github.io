import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/content";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProjectDetail } from "@/components/ProjectDetail";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ id: p.id }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = getProject(id);
  if (!project) notFound();

  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1 pt-24">
        <ProjectDetail project={project} />
      </main>
      <Footer />
    </div>
  );
}
