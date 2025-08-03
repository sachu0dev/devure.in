import Home from '@/components/landing/Home'
import React from 'react'
import ComingSoonCurtain from '@/components/comingSoonCurtain'
import Selected from '@/components/landing/Selected'

const page = () => {
  return (
    <>
      <ComingSoonCurtain>
        <section className="min-h-screen bg-foreground flex  justify-center text-4xl text-background " data-scroll-section>
          <Home/>
        </section>
        <section className="min-h-screen bg-background flex items-center justify-center text-4xl text-foreground" data-scroll-section>
          <Selected/>
        </section>
        <section className=" h-screen bg-foreground flex items-center justify-center text-4xl text-background " data-scroll-section>
          <h1>Section 3</h1>
        </section>
        <section className="h-screen bg-background flex items-center justify-center text-4xl text-foreground" data-scroll-section>
          <h1>Section 4</h1>
        </section>
      </ComingSoonCurtain>
    </>
  )
}

export default page