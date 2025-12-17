import React, { useState } from 'react'
import { assets } from '../assets/assets'

const BgSlider = () => {

    const [sliderPosition, setSliderPosition] = useState(50);

    const handleSliderChange = (e) => {
      setSliderPosition(Number(e.target.value));
    }
  return (
    <div className="pb-10 md:py-20 mx-2">
      {/* title */}
      <h1 className='mb-12 sm:mb-5 text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent'>Remove Background With High<br />Quality and Accuracy</h1>

      <div className='relative w-full max-w-4xl m-auto mt-2 overflow-hidden aspect-[4/3] bg-transparent'>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[80%] h-[80%] overflow-hidden rounded-2xl">
            {/* background image */}
            <img
              src={assets.image_w_bg}
              alt="With background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            />

            {/* foreground image */}
            <img
              src={assets.image_wo_bg}
              alt="Without background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
            />
          </div>
        </div>

        {/* slider */}
        <input
          type="range"
          min={0}
          max={100}
          value={sliderPosition}
          onChange={handleSliderChange}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full z-10 slider"/>
      </div>
    </div>
  )
}

export default BgSlider
