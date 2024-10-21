import React from 'react'
import Fedora from "../../assets/fedora.svg";
import Image from "next/image";


const Aside = () => {
  return (
    <aside className="w-64 bg-[#292a2b] text-white">
        <header className="bg-zinc-900 p-4 h-20 flex justify-center gap-1">
          <Image src={Fedora} width={60} alt="Red Hat logo image" />
          <div className="flex gap-4 items-center">
            <div className="h-full bg-zinc-100 w-[0.1rem]"></div>
            <h1 className="font-bold">Red Hat <br /> <span className="text-lg">Openshift Sizing</span></h1>
          </div>
        </header>
        <nav className="flex flex-col justify-center items-center">
          <div className="w-full h-20 flex hover:bg-[#8f9394] items-center px-8 hover:border-l-4 border-blue-300">
            <a href="#" className="text-lg">Dashboard</a>
          </div>
          <div className="w-full h-20 flex hover:bg-[#8f9394] items-center px-8 hover:border-l-4 border-blue-300">
            <a href="#" className="text-lg">Funcionamento</a>
          </div>
          <div className="w-full h-20 flex hover:bg-[#8f9394] items-center px-8 hover:border-l-4 border-blue-300">
            <a href="#" className="text-lg">Historico</a>
          </div>
        </nav>
      </aside>
  )
}

export default Aside