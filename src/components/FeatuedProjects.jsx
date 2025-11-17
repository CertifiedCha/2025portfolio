import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
// Import the necessary default styles for the carousel appearance
import '@splidejs/react-splide/css/core'; 
import { PROJECTS } from '../constants';

const FeaturedProjects = () => {
    // 1. Filter the data to get only featured projects
    const featuredProjects = PROJECTS.filter(p => p.featured);
    
    // Splide options for a simple, single-slide, continuous carousel
    const splideOptions = {
        type: 'loop', // Loop for infinite scrolling
        perPage: 1,   // Show one project at a time
        arrows: true, // Show arrows for navigation
        pagination: false, // Hide the dots/pagination below the carousel
        speed: 800,
        gap: '1rem',
        classes: {
            arrows: 'splide__arrows featured-arrows',
            arrow: 'splide__arrow featured-arrow text-3xl',
        }
    };

    if (featuredProjects.length === 0) {
        return <div className="text-center text-white p-20">No featured projects found.</div>;
    }

    return (
        <div id="featured-work" className="py-2 max-w-7xl mx-auto">
            <h1 className="text-center text-5xl font-extrabold mb-12 text-white">
                Featured Work
            </h1>

            <Splide options={splideOptions} aria-label="Featured Projects Carousel">
                {featuredProjects.map((project) => (
                    <SplideSlide key={project.id}>
                        <div className="featured-slide-container relative overflow-hidden rounded-lg">
                            
                            {/* Project Image - Main focus */}
                            <img 
                                src={project.image} 
                                alt={project.title} 
                                className="w-full h-auto object-cover"
                            />

                            {/* Text Overlay - Positioned at the bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-10 flex justify-between items-end">
                                
                                {/* Bottom Left: Title and Description */}
                                <div className="w-2/3 text-white">
                                    <h2 className="text-4xl font-bold mb-2">{project.title}</h2>
                                    <p className="text-lg text-gray-300">{project.description}</p>
                                </div>

                                {/* Bottom Right: View Button */}
                                <div className="text-right">
                                    <a 
                                        href={project.links.live} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-block px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        View Project →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </SplideSlide>
                ))}
            </Splide>

            
        </div>
    );
};

export default FeaturedProjects;