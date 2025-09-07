import React from 'react'
import Logo from '../assets/SwiftLogo.svg'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const navigate = useNavigate();
  return (
    <main className="flex justify-between h-16 bg-[#1e2144]  items-center px-8 md:px-48 ">
      {/* Left side (logo) */}
      <div className="flex items-center gap-2 py-1 px-2 rounded-md  bg-gray-200">
        <img  src={Logo} alt="Company Logo" className=" h-8" />
        
      </div>

      {/* Right side (user) */}
      <div
      onClick={()=> navigate('/profile')}
       className='flex gap-2 justify-center items-center'
       >
        <span  className="bg-gray-200 text-[#1e2144] rounded-full px-3 py-1 font- hover:cursor-pointer">EH</span>
        <span className="text-gray-200 hover:cursor-pointer">Erwin Howell</span>
      </div>
    </main>
  )
}

export default Navbar
