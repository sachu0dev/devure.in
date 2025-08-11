"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ComingSoonCurtainProps {
  children: React.ReactNode;
}

const ComingSoonCurtain: React.FC<ComingSoonCurtainProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [peekActive, setPeekActive] = useState(false);
  // const isDev = process.env.NEXT_PUBLIC_NODE_ENV === 'development';
  const isDev = true;

  const handleTakeAPeek = () => {
    setPeekActive(true);
    setIsVisible(false);

    setTimeout(() => {
      setIsVisible(true);
      setPeekActive(false);
    }, 4000);
  };

  // If in development mode, just render children without the curtain
  if (isDev) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[1000] bg-foreground flex flex-col items-center justify-center text-background text-center p-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8">Coming Soon</h1>
            <p className="text-lg md:text-xl mb-12 max-w-2xl">
              We are working hard to bring you an amazing experience. Stay tuned!
            </p>
            <motion.button
              onClick={handleTakeAPeek}
              className="bg-accent text-accent-foreground px-8 py-4 rounded-full text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={peekActive}
            >
              {peekActive ? 'Peeking...' : 'Take a Peek'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default ComingSoonCurtain; 