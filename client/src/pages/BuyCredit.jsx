import React from 'react'
import { assets } from '../assets/assets'

const BuyCredit = () => {
	return (
		<div className="min-h-[80vh] text-center pt-14 mb-10">
			<button>Our Plans</button>
			<h1>Choose the plan that's right for you</h1>
			<div>
				{plans.map((item,index)=>(
					<div>
						<img width={40} src={assets.logo_icon} alt="" />
						<p>{item.id}</p>
						<p>{item.desc}</p>
						<p>
							<span>${item.price}</span>/ {item.credits} credits
						</p>
					</div>
				))}
			</div>
		</div>
	)
}

export default BuyCredit
