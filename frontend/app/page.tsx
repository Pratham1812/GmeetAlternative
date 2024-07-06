import HomeNavbar from "@/components/HomeNavbar";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import img from "@/public/img.png"

export default function Home() {

  return (
    <>
    <div>
      <HomeNavbar />
      <div className="w-screen flex ">
        <div className="p-16 flex-1">
          <Image className="rounded-md items-center mx-auto scale-150 mt-24" alt="Home Page" src={img} />
        </div>
        <div className=" flex-1 p-16">
          <h1 className="mt-10 text-6xl font-bold">Google Meet Alternative</h1>
          <h2 className="text-xl font-semibold mt-10">Hackathon Project by Mohit Verma and Tanisha Dixit</h2>
        </div>

      </div>
    </div>
    </>
  );
}
