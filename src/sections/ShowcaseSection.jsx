import { useRef, useState, useEffect } from "react"; // ⬅️ ADDED useEffect
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { PROJECTS } from "../constants";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const CATEGORIES = [
  { id: "all", name: "Featured Work", image: "/images/categories/featured.png", gradient: "from-purple-500/80 to-pink-500/80" },
  { id: "Mobile App", name: "Mobile Apps", image: "/images/categories/mobile.png", gradient: "from-blue-500/80 to-cyan-500/80" },
  { id: "Web App", name: "Web Applications", image: "/images/categories/webapp.png", gradient: "from-green-500/80 to-emerald-500/80" },
  { id: "3d", name: "3D Projects", image: "/images/categories/3d.png", gradient: "from-yellow-500/80 to-orange-500/80" },
  { id: "UI/UX", name: "UI/UX Design", image: "/images/categories/uiux.png", gradient: "from-pink-500/80 to-rose-500/80" },
  { id: "Frontend", name: "Frontend Projects", image: "/images/categories/frontend.png", gradient: "from-teal-500/80 to-cyan-500/80" },
  { id: "Backend", name: "Backend Projects", image: "/images/categories/backend.png", gradient: "from-orange-500/80 to-red-500/80" },
];

const MAIN_SLIDER_FIXED_HEIGHT = '530px'; 

const ShowcaseSection = () => {
  const mainSplideRef = useRef(null);
  const thumbsSplideRef = useRef(null);
  
  const [selectedCategory, setSelectedCategory] = useState("all");

  const featuredProjects = PROJECTS.filter((p) => p.featured);
  const filteredProjects = selectedCategory === "all" 
    ? featuredProjects 
    : featuredProjects.filter(p => p.category === selectedCategory);

  // 🐛 FIX: Use useEffect to ensure synchronization runs after Splides re-mount
  useEffect(() => {
    if (mainSplideRef.current && thumbsSplideRef.current) {
        const mainSplide = mainSplideRef.current.splide;
        const thumbsSplide = thumbsSplideRef.current.splide;
        
        if (mainSplide && thumbsSplide) {
          // 1. Sync the carousels
          mainSplide.sync(thumbsSplide);
          
          // 2. Reset to the first slide of the new category list
          mainSplide.go(0); 
        }
      }
  }, [filteredProjects.length, selectedCategory]); // Dependencies ensure it runs on category change

  if (!featuredProjects.length && selectedCategory === "all") return null;

  const handlePrev = () => mainSplideRef.current?.splide?.go("<");
  const handleNext = () => mainSplideRef.current?.splide?.go(">");
  const handleCategoryClick = (categoryId) => setSelectedCategory(categoryId);

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
    <div id="work" className="app-showcase py-20 relative">
      <div className="w-3/3 max-w-6xl mx-auto ml-0 relative">
        <h1 className="text-center text-5xl font-extrabold mb-8 text-white">
          {CATEGORIES.find(c => c.id === selectedCategory)?.name || "Featured Work"}
        </h1>

        <div className="flex gap-6 items-start">
          
          {/* LEFT: Main Carousel Section - 2/3 width */}
          <div className="w-9/10 flex flex-col relative min-h-0 flex-shrink-0">
            
            {/* MAIN SLIDER - FIXED HEIGHT ENFORCEMENT */}
            <div 
                className="main-slider-wrapper relative overflow-hidden rounded-xl bg-zinc-900"
                style={{ height: MAIN_SLIDER_FIXED_HEIGHT }}
            >
              <Splide
                // CRITICAL: key forces Splide to destroy/re-create when data changes
                key={filteredProjects.length} 
                options={{
                  type: "move",
                  fixedHeight: MAIN_SLIDER_FIXED_HEIGHT, 
                  pagination: false,
                  arrows: false,
                  cover: true,
                }}
                ref={mainSplideRef}
                aria-label="Main Featured Projects Slider"
              >
                {filteredProjects.map((project) => (
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
                {filteredProjects.length === 0 && (
                    <SplideSlide>
                        <div className="h-full w-full bg-zinc-800 flex items-center justify-center rounded-xl">
                            <p className="text-xl text-gray-400 p-10">No featured projects found in this category.</p>
                        </div>
                    </SplideSlide>
                )}
              </Splide>

              {/* DARK SIDE ZONES, ARROWS... */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black/50 via-black/20 to-transparent pointer-events-none z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black/50 via-black/20 to-transparent pointer-events-none z-10"></div>
              
              <div className="absolute inset-0 flex items-center justify-between px-6 pointer-events-none z-20">
                <motion.button 
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
                // CRITICAL: key forces Splide to destroy/re-create when data changes
                key={`thumbs-${filteredProjects.length}`}
                options={{
                  rewind: true, isNavigation: true, gap: "12px", focus: "center", pagination: false, arrows: false, cover: true,
                  fixedWidth: 110, fixedHeight: 60,
                  breakpoints: { 640: { fixedWidth: 70, fixedHeight: 40, gap: "6px" } },
                }}
                ref={thumbsSplideRef}
                aria-label="Thumbnail Navigation"
              >
                {filteredProjects.map((project) => (
                  <SplideSlide key={`thumb-${project.id}`} className="group relative">
                    <img src={project.image} alt={`Thumbnail for ${project.title}`} className="w-full h-full object-cover rounded-md cursor-pointer border-2 border-transparent group-hover:border-blue-500 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-transparent group-[.is-active]:bg-blue-500 transition-all duration-300"></div>
                  </SplideSlide>
                ))}
              </Splide>
            </div>
          </div>

          {/* RIGHT: Category Sidebar - 1/3 width (Scrollable) */}
          <div className="w-4/9 flex-shrink-0">
            <div 
              className="backdrop-blur-sm rounded-xl border border-black p-2 overflow-y-auto overflow custom-scrollbar overflow-x-hidden"
              style={{ height: MAIN_SLIDER_FIXED_HEIGHT }} 
            >

              <div className="space-y-3">
                {CATEGORIES.map((category) => (
                  <motion.button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full group relative overflow-hidden rounded-lg transition-all duration-300 ${
                      selectedCategory === category.id 
                        ? 'ring-2 ring-blue-500' 
                        : ''
                    }`}
                    style={{ height: `${parseInt(MAIN_SLIDER_FIXED_HEIGHT) * (2 / CATEGORIES.length)}px` }}
                  >
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h4 className="text-white text-lg font-bold text-center px-4 drop-shadow-lg">
                        {category.name}
                      </h4>
                    </div>
                    {selectedCategory === category.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* 🚀 ENHANCED SCROLLBAR STYLES for visual scroll feedback */
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px; /* Increased width */
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.15); /* Slightly brighter track */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 1); /* Opaque Blue-500 for high visibility */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 99, 235, 1); /* Darker blue on hover */
        }
        /* Enforce absolute height on the Splide track to prevent vertical movement */
        .main-slider-wrapper :global(.splide__track) {
            height: ${MAIN_SLIDER_FIXED_HEIGHT} !important;
        }
      `}</style>
    </div>
  );
};

export default ShowcaseSection;