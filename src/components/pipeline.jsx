import React, { useEffect, useRef } from 'react';
import { useGSAP } from "@gsap/react";

// --- START: Utility Constants from your files (util.js) ---
const { PI, cos, sin, abs, sqrt, pow, round, random, atan2 } = Math;
const HALF_PI = 0.5 * PI;
const TAU = 2 * PI;
const TO_RAD = PI / 180;
const rand = n => n * random();
const randIn = (min, max) => rand(max - min) + min;

// Function used for pipe opacity fading
const fadeInOut = (t, m) => {
	let hm = 0.5 * m;
	return abs((t + hm) % m - hm) / (hm);
};
// --- END: Utility Constants ---

// The Simplex Noise library (noise.min.js) would need to be imported here
// For a standard React setup, you'd install a Simplex Noise library from npm (e.g., 'simplex-noise')
// or copy the minified code into a separate file and import the SimplexNoise class.
// ***ASSUMING you have a class/function 'SimplexNoise' available globally or imported***
// import SimplexNoise from '../utils/SimplexNoise'; 

// --- START: Pipeline Configuration (pipeline.js) ---
const pipeCount = 30;
const pipePropCount = 8;
const pipePropsLength = pipeCount * pipePropCount;
const turnCount = 8;
const turnAmount = (360 / turnCount) * TO_RAD; // 45 degrees in radians
const turnChanceRange = 58;
const baseSpeed = 0.5;
const rangeSpeed = 1;
const baseTTL = 100;
const rangeTTL = 300;
const baseWidth = 2;
const rangeWidth = 4;
const baseHue = 180;
const rangeHue = 60;
const backgroundColor = 'hsla(150,80%,1%,1)'; 
// --- END: Pipeline Configuration ---


const PipelineBackground = () => {
    const containerRef = useRef(null);
    const canvasARef = useRef(null);
    const canvasBRef = useRef(null);
    let ctxA, ctxB, center, tick, pipeProps, animationFrameId;

    // The entire canvas setup, update, and draw logic
    const { contextSafe } = useGSAP(); // useGSAP for component safety and optional GSAP integration

    // Initialize all pipe properties
    const initPipe = (i) => {
        let x, y, direction, speed, life, ttl, width, hue;
        
        // Start pipe at a random X and the center Y
        x = rand(canvasARef.current.width);
        y = center[1];
        // Initial direction is either UP (HALF_PI) or DOWN (TAU - HALF_PI)
        direction = (round(rand(1)) ? HALF_PI : TAU - HALF_PI); 
        speed = baseSpeed + rand(rangeSpeed);
        life = 0;
        ttl = baseTTL + rand(rangeTTL);
        width = baseWidth + rand(rangeWidth);
        hue = baseHue + rand(rangeHue);

        pipeProps.set([x, y, direction, speed, life, ttl, width, hue], i);
    };

    // Initialize all pipes
    const initPipes = () => {
        pipeProps = new Float32Array(pipePropsLength);
        for (let i = 0; i < pipePropsLength; i += pipePropCount) {
            initPipe(i);
        }
    };

    // Draw a single pipe particle (on the buffer canvas A)
    const drawPipe = (x, y, life, ttl, width, hue) => {
        ctxA.save();
        // Opacity fades in and out based on its life cycle
        ctxA.strokeStyle = `hsla(${hue},75%,50%,${fadeInOut(life, ttl) * 0.125})`; 
        ctxA.beginPath();
        ctxA.arc(x, y, width, 0, TAU);
        ctxA.stroke();
        ctxA.closePath();
        ctxA.restore();
    };

    // Update the position and state of a single pipe
    const updatePipe = (i) => {
        let i2=1+i, i3=2+i, i4=3+i, i5=4+i, i6=5+i, i7=6+i, i8=7+i;
        let x, y, direction, speed, life, ttl, width, hue, turnChance, turnBias;
    
        x = pipeProps[i];
        y = pipeProps[i2];
        direction = pipeProps[i3];
        speed = pipeProps[i4];
        life = pipeProps[i5];
        ttl = pipeProps[i6]
        width = pipeProps[i7];
        hue = pipeProps[i8];
    
        drawPipe(x, y, life, ttl, width, hue);
    
        life++;
        x += cos(direction) * speed;
        y += sin(direction) * speed;
        
        // Check for turning condition (random chance AND on a grid line multiple of 6)
        turnChance = !(tick % round(rand(turnChanceRange))) && (!(round(x) % 6) || !(round(y) % 6));
        turnBias = round(rand(1)) ? -1 : 1;
        direction += turnChance ? turnAmount * turnBias : 0;
    
        // Loop back to the other side if out of bounds (CheckBounds logic)
        if (x > canvasARef.current.width) x = 0;
        if (x < 0) x = canvasARef.current.width;
        if (y > canvasARef.current.height) y = 0;
        if (y < 0) y = canvasARef.current.height;

        pipeProps[i] = x;
        pipeProps[i2] = y;
        pipeProps[i3] = direction;
        pipeProps[i5] = life;
    
        // Reinitialize if life has expired
        life > ttl && initPipe(i);
    };

    // Update all pipes
    const updatePipes = () => {
        tick++;
        for (let i = 0; i < pipePropsLength; i += pipePropCount) {
            updatePipe(i);
        }
    };

    // Render the final image from the buffer (A) to the visible canvas (B)
    const render = () => {
        // 1. Fill visible canvas (B) with the dark background color
        ctxB.save();
        ctxB.fillStyle = backgroundColor;
        ctxB.fillRect(0, 0, canvasBRef.current.width, canvasBRef.current.height);
        ctxB.restore();

        // 2. Draw buffer (A) with a blur filter to create the glow
        ctxB.save();
        ctxB.filter = 'blur(12px)';
        ctxB.drawImage(canvasARef.current, 0, 0);
        ctxB.restore();

        // 3. Draw buffer (A) again without filter for the sharp line center
        ctxB.save();
        ctxB.drawImage(canvasARef.current, 0, 0);
        ctxB.restore();

        // 4. Clear the buffer canvas (A) for the next frame
        ctxA.clearRect(0, 0, canvasARef.current.width, canvasARef.current.height);
    };

    // Main animation loop
    const draw = () => {
        updatePipes();
        render();
        animationFrameId = window.requestAnimationFrame(draw);
    };

    // Resize handler
    const resizeHandler = () => {
        const { innerWidth, innerHeight } = window;
        
        // Resize buffer canvas A
        canvasARef.current.width = innerWidth;
        canvasARef.current.height = innerHeight;
        
        // Copy content from B to A (This preserves trails on resize, though clearing A below)
        ctxA.drawImage(canvasBRef.current, 0, 0);
        
        // Resize visible canvas B
        canvasBRef.current.width = innerWidth;
        canvasBRef.current.height = innerHeight;
        
        // Copy content from A to B (Redraws preserved content on B)
        ctxB.drawImage(canvasARef.current, 0, 0);

        // Update center coordinates
        center = [0.5 * innerWidth, 0.5 * innerHeight];
        
        // Re-initialize pipes to start from the new center
        initPipes();
    };

    // useEffect for component mounting and unmounting
    useEffect(() => {
        // 1. Get contexts
        ctxA = canvasARef.current.getContext('2d');
        ctxB = canvasBRef.current.getContext('2d');
        tick = 0;
        center = [];

        // 2. Initial setup
        resizeHandler();
        
        // 3. Start animation loop
        draw();

        // 4. Attach resize listener
        window.addEventListener('resize', resizeHandler);

        // 5. Cleanup function
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeHandler);
        };
    }, []); 

    // The component renders two canvases: one for drawing (A - hidden) and one for display (B - visible)
    return (
        <div ref={containerRef} className="pipeline-canvas-container">
            {/* Canvas B (Visible Canvas) - Stretched to fill the hero section */}
            <canvas ref={canvasBRef} style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0 // Place behind all content
            }} />
            
            {/* Canvas A (Drawing Buffer) - Kept hidden */}
            <canvas ref={canvasARef} style={{ display: 'none' }} />
        </div>
    );
};

export default PipelineBackground;