import React from 'react'
import HeroSection from '../Components/Common/Loading'
import FeaturesTimeline from '../Components/Common/Feautre'
import HowItWorks from '../Components/Common/Work'
import CTASection from '../Components/Common/Action'
import ComparisonTable from '../Components/Common/Compariso'

function Home() {
  return (
    <div>
        <HeroSection/>
        <FeaturesTimeline/>
        <HowItWorks/>
        <CTASection/>
        <ComparisonTable/>
    </div>
  )
}

export default Home