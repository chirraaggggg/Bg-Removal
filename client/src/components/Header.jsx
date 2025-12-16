import React from 'react'
import { assets } from '../assets/assets'
const Header = () => {
  return (
    <div>
      {/* ---------- Left side ---------- */}
      <div>
        <h1>Remove the <br /> <span>background</span> from <br /> images for free.</h1>
        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. <br /> Lorem Ipsum has been the industry's standard dummy text ever.</p>
        <div>
            <input type="file" name="" id="upload1" hidden />
            <label htmlFor="upload1">
                <img src={assets.upload_btn_icon} alt="" />
                <p>Upload yout image</p>
            </label>
        </div>
      </div>
      {/* ---------- Left side ---------- */}
      <div>

      </div>
    </div>
  )
}

export default Header
