"use client"

import Link from 'next/link'
import React from 'react'
import ImageStack from './ImageStack'

const Home = () => {
  return (
    <div className='w-full max-w-[110rem] flex  h-full text-background pt-[8rem] px-5 pb-24'>
        <div className=' w-[50%] h-full flex flex-col justify-between'>
          <div className='text-[136px] font-[900] mb-12'>
          <h1>GENUINE.</h1>
          <h1>IMPACT.</h1>
          </div>
          <div className='text-2xl font-[400] flex flex-col justify-between w-[70%]'>
            <p className='mb-8'>At Devure.in, we help businesses build, launch, and scale custom web applications — blending design, development, and technical expertise to deliver solutions that work and grow with you.</p>
            <div className='flex flex-col text-sm text-[#618C70] font-bold uppercase '>

                <Link href={""}>Linkdin</Link>
                <Link href={""}>Linkdin</Link>
                <Link href={""}>Linkdin</Link>
                <Link className='text-background' href={""}>Linkdin</Link>

            </div>
          </div>
        </div>
        <div className="w-[50%] flex-1 h-full flex items-center justify-center">
            <ImageStack />
        </div>
    </div>
  )
}

export default Home