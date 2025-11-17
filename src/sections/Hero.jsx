import React from 'react'; // Added explicit React import for clarity, though it's often implicit now
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Import the Card component (with your social buttons)

// Import your new typewriter component here
import AestheticTypewriter from "../hooks/AestheticTypewriter";
import { ShimmeringText } from "../components/texts/ShimmeringTexts";
import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import { words } from "../constants";
import HeroExperience from "../components/models/hero_models/HeroExperience";

const Hero = () => {
  useGSAP(() => {
    // Keep the GSAP animation for the static <h1> tags
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
gsap.fromTo(
    ".hero-text h2",
    // FROM: Start State
    { 
        y: -100,      // Start 100 pixels above its final position
        x: -1000,      // ⬅️ Start 100 pixels to the LEFT of its final position
        scale: 0,     // Start very small
        opacity: 0 
    },
    // TO: End State
    { 
        y: 0,         // Ends at its natural vertical position
        x: 0,         // ➡️ Ends at its natural horizontal position
        scale: 1,     // Ends at its natural size
        opacity: 1, 
        stagger: 0.08, 
        duration: 1.5,
        ease: "bounce.out", 
        delay: 2    
    }
);
  });

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="" />
      </div>

      <div className="hero-layout">
        {/* LEFT: Hero Content */}
        <header className="flex flex-col justify-center md:w-full w-screen md:px-30 px-5">
          <div className="flex flex-col gap-7">
            <div className="hero-text">
              <h1 className="my-0 leading-none mb-0.5">
                Hey! I'm            <ShimmeringText className="my-0 leading-none mt-2"text="Darius Charles" />

              </h1>
              <AestheticTypewriter words={words} />
              
              <h2 className="my-0 leading-none">&#8212; that works hard😁 </h2>
            </div>

            {/* VVV --- YOUR NEW SOCIAL BUTTONS (CARD) COMPONENT HERE --- VVV */}
            {/* ^^^ ---------------------------------------------------- ^^^ */}

            <p className="text-white-50 md:text-xl relative z-10 pointer-events-none">
              Creative Student Developer specializing in 3D & Web technologies
            </p>
            

            <Button
              text="See My Work"
              className="md:w-80 md:h-16 w-60 h-12"
              id="counter"
            />

          </div>
          
        </header>

        {/* RIGHT: 3D Model or Visual */}
        <figure>
          <div className="hero-3d-layout pl-40">
            <HeroExperience />
          </div>
        </figure>
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;