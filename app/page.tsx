import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { Work } from "@/components/sections/Work";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Experience } from "@/components/sections/Experience";
import { Stories } from "@/components/sections/Stories";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero>
        <Intro />
      </Hero>
      <Work />
      <About />
      <Services />
      <Experience />
      <Stories />
      <Contact />
    </>
  );
}
