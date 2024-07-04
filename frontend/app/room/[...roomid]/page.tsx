"use client"

 
export default function Page({params}:any) {
    const roomid = params.roomid

  return (
    <>
    <h1>Room Id : {roomid}</h1>
    </>
  )
}