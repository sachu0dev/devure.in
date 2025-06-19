"use client"

import Link from 'next/link'
import React from 'react'
import ImageStack from './ImageStack'
import { motion } from 'framer-motion'

const textContainerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.13,
    },
  },
};

const textBounceVariants = {
  initial: { x: -120, y: 0, scale: 1.03, opacity: 0 },
  animate: {
    x: 0,
    y: [0, 8, -4, 2, 0],
    scale: [1.03, 1, 0.995, 1.01, 1],
    opacity: 1,
    transition: {
      x: { stiffness: 80, damping: 18, duration: 0.7 },
      y: { stiffness: 300, damping: 18, duration: 1.1 },
      scale: { duration: 1.1 },
      opacity: { duration: 0.3 },
    },
  },
};

const rightFadeVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.8 },
  },
};

const Home = () => {
  return (
    <div className='w-full max-w-[110rem] flex flex-col lg:flex-row h-auto text-background px-3 md:px-6 pb-8 lg:pb-16 pt-[8rem]'>
        <div className='w-full lg:w-[50%] flex flex-col justify-between mb-8 lg:mb-0'>
          <motion.div
            className='text-[72px] md:text-[90px] lg:text-[100px] xl:text-[140px] font-[900] mb-6 lg:mb-10 leading-[1.05] flex flex-col'
            variants={textContainerVariants}
            initial='initial'
            animate='animate'
          >
            <motion.h1 variants={textBounceVariants} style={{ willChange: 'transform, opacity' }}>
              GENUINE.
            </motion.h1>
            <motion.h1 variants={textBounceVariants} style={{ willChange: 'transform, opacity' }}>
              IMPACT.
            </motion.h1>
          </motion.div>
          <motion.div
            variants={rightFadeVariants}
            initial="initial"
            animate="animate"
            className="text-base sm:text-lg md:text-xl lg:text-2xl font-[400] flex flex-col justify-between w-full md:w-[90%] lg:w-[85%] xl:w-[70%]"
          >
            <p className='mb-6'>At Devure.in, we help businesses build, launch, and scale custom web applications — blending design, development, and technical expertise to deliver solutions that work and grow with you.</p>
            <div className='flex flex-col text-xs sm:text-sm text-[#618C70] font-bold uppercase'>
                <Link href={""} className="hover:text-background transition-colors duration-300">Linkdin</Link>
                <Link href={""} className="hover:text-background transition-colors duration-300">Linkdin</Link>
                <Link href={""} className="hover:text-background transition-colors duration-300">Linkdin</Link>
                <Link className='text-background hover:text-[#618C70] transition-colors duration-300' href={""}>Linkdin</Link>
            </div>
          </motion.div>
        </div>
        <motion.div
          className="w-full lg:w-[50%] flex-1 flex items-center justify-center"
          variants={rightFadeVariants}
          initial="initial"
          animate="animate"
        >
          <ImageStack />
        </motion.div>
    </div>
  )
}

export default Home