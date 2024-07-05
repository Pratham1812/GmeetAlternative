"use client"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'

const HomeNavbar = () => {
    const router = useRouter()
    const handleButton = () => {
        router.push("/auth/signin")
      }
    return (
        <nav className="flex flex-wrap items-center justify-between w-full h-16 md:h-20 lg:h-24 px-8 bg-slate-800 text-white">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-3xl font-semibold">GMeet</Link>
          </div>
          <div className="hidden lg:flex flex-grow justify-center">
            <Link href="/" className="mx-4">Home</Link>
            <Link href ="/about" className="mx-4">About Us</Link>
          </div>
          <div className="flex justify-center">
          <button onClick={handleButton} className="mx-4 bg-slate-50 text-black rounded-lg p-3">Login</button>
    
          </div>
        </nav>
      );
    };


export default HomeNavbar