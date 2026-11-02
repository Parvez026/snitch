import React from 'react'

const Footer = () => {
  return (
       <footer
        id="contact"
        className="bg-[#101010] px-6 py-12 text-white"
      >
        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-8 md:flex-row md:items-center">

          <div>
            <h2 className="text-3xl font-black tracking-[0.3em]">
              SNITCH
            </h2>

            <p className="mt-3 text-sm text-gray-400">
              Redefine your everyday style.
            </p>
          </div>

          <div className="text-xs text-gray-500">
            © 2026 SNITCH. All rights reserved.
          </div>
        </div>
      </footer>
  )
}

export default Footer