//Original Code
  import { useRef } from "react";
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { useGSAP } from "@gsap/react";
  import { Splide, SplideSlide } from "@splidejs/react-splide";
  import "@splidejs/react-splide/css";
  import { PROJECTS } from "../constants";
  import { motion } from "framer-motion";
  import { ArrowLeft, ArrowRight } from "lucide-react";

  gsap.registerPlugin(ScrollTrigger);

  const ShowcaseSection = () => {
    const sectionRef = useRef(null);
    const mainSplideRef = useRef(null);
    const thumbsSplideRef = useRef(null);
    const leftShadowRef = useRef(null);
    const rightShadowRef = useRef(null);
    const leftArrowRef = useRef(null);
    const rightArrowRef = useRef(null);

    const featuredProjects = PROJECTS.filter((p) => p.featured);

    useGSAP(() => {
      if (mainSplideRef.current && thumbsSplideRef.current) {
        const mainSplide = mainSplideRef.current.splide;
        const thumbsSplide = thumbsSplideRef.current.splide;
        if (mainSplide && thumbsSplide) mainSplide.sync(thumbsSplide);
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        sectionRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
      )
        .fromTo(
          [leftShadowRef.current, rightShadowRef.current],
          { opacity: 0 },
          { opacity: 1, duration: 1, stagger: 0.1 },
          "-=0.6"
        )
        .fromTo(
          leftArrowRef.current,
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.4"
        )
        .fromTo(
          rightArrowRef.current,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6"
        );
    }, [featuredProjects.length]);

    if (!featuredProjects.length) return null;

    const handlePrev = () => mainSplideRef.current?.splide?.go("<");
    const handleNext = () => mainSplideRef.current?.splide?.go(">");

    const arrowVariants = {
      rest: { scale: 1, opacity: 0.9 },
      hover: {
        delay: 0,
        scale: 1.2,
        opacity: 1,
        boxShadow: "0 0 25px rgba(59,130,246,0.8)",
        backgroundColor: "rgba(59,130,246,0.2)",
      },
      tap: { scale: 0.9 },
    };

    return (
      
      <div id="work" ref={sectionRef} className="app-showcase py-25 relative">
        
        <div className="w-2/3 max-w-6xl mx-auto ml-0 relative">
          <h1 className="text-center text-5xl font-extrabold mb-5 text-white">
            Featured Work
          </h1>

          {/* MAIN SLIDER */}
          <div className="main-slider-wrapper relative overflow-hidden rounded-xl">
            <Splide
              options={{
                type: "move",
                heightRatio: 0.5,
                pagination: false,
                arrows: false,
                cover: true,
              }}
              ref={mainSplideRef}
              aria-label="Main Featured Projects Slider"
            >
              {featuredProjects.map((project) => (
                <SplideSlide key={project.id}>
                  <div className="relative h-full">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex justify-between items-end">
                      <div className="w-2/3 text-white">
                        <h2 className="text-3xl font-bold mb-1">{project.title}</h2>
                        <p className="text-sm text-gray-300">{project.description}</p>
                      </div>
                      <div className="text-right">
                        <a
                          href={project.links.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
                        >
                          View Project →
                        </a>
                      </div>
                    </div>
                  </div>
                </SplideSlide>
              ))}
            </Splide>

            {/* DARK SIDE ZONES */}
            <div
              ref={leftShadowRef}
              className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none z-10"
            ></div>
            <div
              ref={rightShadowRef}
              className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/50 via-black/20 to-transparent pointer-events-none z-10"
            ></div>

            {/* CUSTOM ARROWS */}
            <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none z-20">
              <motion.button
                ref={leftArrowRef}
                variants={arrowVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handlePrev}
                className="pointer-events-auto bg-white/20 backdrop-blur-md border border-white/30 text-white p-5 rounded-full transition-all duration-300 shadow-lg"
              >
                <ArrowLeft size={34} />
              </motion.button>

              <motion.button
                ref={rightArrowRef}
                variants={arrowVariants}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                onClick={handleNext}
                className="pointer-events-auto bg-white/20 backdrop-blur-md border border-white/30 text-white p-5 rounded-full transition-all duration-300 shadow-lg"
              >
                <ArrowRight size={34} />
              </motion.button>
            </div>
          </div>

          {/* THUMB SLIDER */}
          <div className="thumbnail-slider-wrapper mt-5 relative">
            <Splide
              options={{
                rewind: true,
                isNavigation: true,
                gap: "12px",
                focus: "center",
                pagination: false,
                arrows: false,
                cover: true,
                fixedWidth: 110,
                fixedHeight: 60,
                breakpoints: {
                  640: { fixedWidth: 70, fixedHeight: 40, gap: "6px" },
                },
              }}
              ref={thumbsSplideRef}
              aria-label="Thumbnail Navigation"
            >
              {featuredProjects.map((project, idx) => (
                <SplideSlide key={`thumb-${project.id}`} className="group relative">
                  <img
                    src={project.image}
                    alt={`Thumbnail for ${project.title}`}
                    className="w-full h-full object-cover rounded-md cursor-pointer border-2 border-transparent group-hover:border-blue-500 transition-all duration-300"
                  />
                  {/* Line Indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-[.is-active]:bg-blue-500 transition-all duration-300"></div>
                </SplideSlide>
              ))}
            </Splide>
          </div>

        
        </div>
      </div>
    );
  };

  export default ShowcaseSection;