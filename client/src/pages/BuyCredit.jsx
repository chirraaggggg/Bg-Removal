import React from 'react'
import { assets, plans } from '../assets/assets'

const BuyCredit = () => {
	return (
		<div className="min-h-[80vh] text-center pt-14 mb-10">
			<button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
			<h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent'>Choose the plan that's right for you</h1>
			<div>
				{plans.map((item,index)=>(
					<div>
						<img width={40} src={assets.logo_icon} alt="" />
						<p>{item.id}</p>
						<p>{item.desc}</p>
						<p>
							<span>${item.price}</span>/ {item.credits} credits
						</p>
						<button>Purchase</button>
					</div>
				))}
			</div>
		</div>
	)
}

export default BuyCredit
