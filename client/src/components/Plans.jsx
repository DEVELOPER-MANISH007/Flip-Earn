import { PricingTable } from '@clerk/clerk-react'
import React from 'react'

const Plans = () => {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30 max-md:px-4'>
      <div className='text-center'>
        <h1 className='text-gray-700 text-4xl font-semibold'>Choose Your Plan</h1>
          <p className=' text-sm max-w-md mx-auto text-gray-700'>Start for free and scale up as you grow. Find the perfect plan for your
          content creation needs.</p>
      </div>
      <div className='mt-14'>
        <PricingTable/>
      </div>
    </div>
  )
}

export default Plans