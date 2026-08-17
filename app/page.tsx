import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { ChapterTitle } from "@/components/ChapterTitle";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { GithubStats } from "@/components/GithubStats";
import { StackOrbit } from "@/components/StackOrbit";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="flex-1">
        <Hero />

        <ChapterTitle kicker="Ep. 01" title="About" />
        <About />

        <ChapterTitle kicker="Ep. 02" title="Work" />
        <Projects />
        <GithubStats />

        <StackOrbit />

        <ChapterTitle kicker="Ep. 04" title="Frames" />
        <Gallery />

        <Contact />
      </main>
      <Footer />
    </div>
  );
}
