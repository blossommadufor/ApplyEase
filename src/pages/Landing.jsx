import React from 'react'
import LandingHero from '../components/LandingHero'
import Features from '../components/Features'
import FAQ from '../components/FAQ'
import { Footer } from '../components/Footer'

const Landing = () => {
  return (
    <div>
      <LandingHero/>
      <Features/>
      <FAQ/>
      <Footer/>
    </div>
  )
}

export default Landing
