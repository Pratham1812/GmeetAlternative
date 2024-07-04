"use client"
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const page = () => {
  const router = useRouter()
  const [roomid, setRoomid] = useState('')

  const joinRoom = () => {
    router.push(`/room/${roomid || Math.random().toString(36).slice(2)}`)
  }

  return (
    <>
    <Navbar/>
    <div className="">

      <main className="flex flex-col gap-4 justify-center w-screen items-center ">
       <h1>Lets join a room!</h1>
       <input onChange={(e) => setRoomid(e.target.value)} value={roomid} className="w-96 border rounded-md" />
       <button onClick={joinRoom} type="button" className="p-3 text-black rounded-md bg-slate-400">Join Room</button>
      </main>
    </div>
    </>
  )
}

export default page