"use client"

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import gsap from 'gsap';

const Header = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true); // State to track if at the top of the page

  const duLogoRef = useRef<HTMLSpanElement>(null);
  const devureTextRef = useRef<HTMLSpanElement>(null);
  const buttonBgRef = useRef<HTMLSpanElement>(null); // Ref for the rising background

  // Refs for individual letters of the button text
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  letterRefs.current = []; // Clear on each render to avoid stale refs

  const addToRefs = (el: HTMLSpanElement) => {
    if (el && !letterRefs.current.includes(el)) {
      letterRefs.current.push(el);
    }
  };

  // Ref for the hover timeline, to control play/reverse
  const buttonHoverTl = useRef<gsap.core.Timeline | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();

    // Handle header hide/show based on scroll direction
    if (previous !== undefined) {
      if (latest > previous && latest > 50) {
        setHidden(true); // Scrolling down, hide header
      } else if (latest < previous || latest <= 50) {
        setHidden(false); // Scrolling up or at the top, show header
      }
    } else if (latest <= 50) {
      setHidden(false); // At the very top (initial load or refreshed), ensure header is visible
    }

    // Handle float state based on scroll position
    setAtTop(latest <= 20); // Set to true if within 20px of the top
  });

  useEffect(() => {
    const tl = gsap.timeline({
      defaults: { duration: 0.3, ease: "power2.inOut" }
    });

    if (atTop) {
      // Animate text back in and logo to normal state, and adjust font size
      tl.to(duLogoRef.current, { scale: 1.2, rotation: 0, x: 0, y: 0 }, 0) // DU scales up
        .fromTo(devureTextRef.current,
          { x: -30, opacity: 0, display: 'inline-block', fontSize: '1.5rem' }, // Start at normal size
          { x: 0, opacity: 1, display: 'inline-block', fontSize: '3rem' } // Animate to 5xl (3rem)
        );
    } else {
      // Animate text out and logo shake, and adjust font size
      tl.to(devureTextRef.current, { 
          x: -30, opacity: 0, fontSize: '1.5rem', duration: 0.2, // Animate to normal size while sliding out
          onComplete: () => {
            gsap.set(devureTextRef.current, { display: 'none' }); // Hide after animation
          }
        }, 0) // Slide text left and fade out
        .to(duLogoRef.current, { 
          scale: 1, // DU scales down to normal
          rotation: "random(-10, 10)", // Random rotation for shake
          x: "random(-5, 5)", // Random X movement
          y: "random(-5, 5)", // Random Y movement
          duration: 0.1, // Quick, snappy shake
          repeat: 3, // Repeat multiple times for a good shake
          yoyo: true, // Go back and forth
          ease: "power1.inOut",
          onComplete: () => {
            // After shake, reset DU to normal size and position (already done with scale: 1 above)
            gsap.to(duLogoRef.current, { rotation: 0, x: 0, y: 0, duration: 0.2 });
          }
        }, 0.1); // Start shake slightly after text begins moving
    }

    return () => {
      tl.kill(); // Kill the timeline on unmount or state change
    };
  }, [atTop]);

  // Initialize button hover timeline once on mount
  useEffect(() => {
    if (buttonBgRef.current && letterRefs.current.length > 0 && !buttonHoverTl.current) {
      buttonHoverTl.current = gsap.timeline({ paused: true, defaults: { duration: 0.3, ease: "power2.out" } })
        .to(buttonBgRef.current, { scaleY: 1, backgroundColor: "#cce561" }, 0)
        .to(letterRefs.current, { // Animate individual letters
          y: -5, // Initial lift
          x: "random(-3, 3)", // Initial random horizontal shift
          rotation: "random(-5, 5)", // Initial random rotation
          stagger: 0.05, // Stagger the animation of each letter
          ease: "power1.inOut",
          duration: 0.2, // Quick initial movement
        }, 0) // Start with background
        .to(letterRefs.current, { // Continuous wave-like float
          y: "random(-3, 3)", // Continuous random vertical float
          x: "random(-2, 2)", // Continuous random horizontal float
          rotation: "random(-3, 3)", // Continuous random rotation
          yoyo: true, 
          repeat: -1, 
          ease: "sine.inOut",
          duration: 0.6, // Slower continuous movement
          stagger: { from: "random", amount: 0.1 } // Random stagger for wave effect
        }, ">"); // Start after previous animation
    }
  }, []); // Depend on buttonBgRef and letterRefs.current.length

  const onButtonHoverEnter = () => {
    buttonHoverTl.current?.play();
  };

  const onButtonHoverLeave = () => {
    buttonHoverTl.current?.reverse();
  };

  const buttonText = "Let's talk";

  return (
    <motion.header
      variants={{
        visible: { y: "0%" },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`w-full fixed top-0 left-0 z-50 flex justify-center items-center font-figtree text-primary-foreground`}
      style={{ 
        height: atTop ? '8rem' : '4rem', 
        transition: 'height 0.35s ease-in-out, background-color 0.35s ease-in-out, box-shadow 0.35s ease-in-out' 
      }}
    >
      <div className='w-full max-w-[110rem] flex justify-between items-center px-5'>
        <Link href="/" className="text-3xl font-bold flex items-center gap-2 justify-center">
          <motion.span
            ref={duLogoRef}
            className="text-2xl font-extrabold border-2 bg-foreground text-accent-foreground px-3 py-1 rounded-md mr-2"
          >
            DU
          </motion.span>
          <motion.span
            ref={devureTextRef}
            className=""
          >
            Devure.in
          </motion.span>
        </Link>
        <div className='flex gap-4'>
          <nav className="flex gap-8 px-4 rounded-2xl text-xl font-[400] items-center bg-foreground">
            <Link href="#" className="relative group py-2">
              Work
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="#" className="relative group py-2">
              Services
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="#" className="relative group py-2">
              Blogs
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="#" className="relative group py-2">
              Technology
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="#" className="relative group py-2">
              Experince
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-accent transition-all duration-300 ease-out group-hover:w-full"></span>
            </Link>
          </nav>
          <Link
            href="#"
            className="relative overflow-hidden bg-primary font-bold px-5 py-3 text-black rounded-full flex items-center gap-2"
            onMouseEnter={onButtonHoverEnter}
            onMouseLeave={onButtonHoverLeave}
          >
            <span className="absolute inset-0 origin-bottom scale-y-0 bg-primary" ref={buttonBgRef}></span>
            <span className="relative z-10 flex items-center gap-0.5 whitespace-nowrap">
              {buttonText.split('').map((char, index) => (
                <motion.span
                  key={index}
                  ref={addToRefs}
                  className="inline-block"
                >
                  {char === ' ' ? '\u00A0' : char} {/* Render space as non-breaking space */}
                </motion.span>
              ))}
              <span className="text-xl ml-1">→</span> {/* Arrow always visible */}
            </span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;