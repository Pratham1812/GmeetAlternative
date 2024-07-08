"use client"
import { useEffect, useRef, useState } from 'react';
import useSocket from '../../../hooks/useSocket';
import {useRouter, useSearchParams } from 'next/navigation';
import handleRoomCreated from '@/utils/handleRoomCreated';
import handleRoomJoined from '@/utils/handleRoomJoined';
import initiateCall from '@/utils/initiateCall';
import onPeerLeave from '@/utils/onPeerLeave';
import handleReceivedOffer from '@/utils/handleReceivedOffer';
import handleAnswer from '@/utils/handleAnswer';
import handlerNewIceCandidateMsg from '@/utils/handlerNewIceCandidateMsg';
import leaveRoom from '@/utils/leaveRoom';
import createPeerConnection from '@/utils/createPeerConnection';
import handleICECandidateEvent from '@/utils/handleIceCandidateEvent';
import handleTrackEvent from '@/utils/handleTrackEvent';
import toggleMic from '@/utils/toggleMic';
import toggleCamera from '@/utils/toggleCamera';
import handleScreenShare from '@/utils/handleScreenShare';
import stopAudioRecording from '@/utils/stopAudioRecording';


const Room = () => {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const url: string = process.env.NEXT_PUBLIC_SIGNALING_SERVER_URL as string
  const socket = useSocket(url);
  const router=useRouter();
  const param = useSearchParams();
  const mediaRecorder=useRef<MediaRecorder|null>(null);
  const audioChunks=useRef<Blob[]|null>(null);
  const audioUrl=useRef<String|null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenShareRef = useRef<HTMLVideoElement>(null);
  const rtcConnectionRef = useRef<RTCPeerConnection | null>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const hostRef = useRef<boolean>(false);
  const roomNameParam:string|null=param.get('roomName');
  const roomName:string=roomNameParam?roomNameParam:"";
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (socket != null) {
      socket.emit('join', roomName);
      socket.on("created", () => handleRoomCreated(hostRef,userStreamRef, userVideoRef,mediaRecorder,audioChunks,audioUrl));
      socket.on("joined", () => handleRoomJoined(userStreamRef, userVideoRef, socket, roomName,mediaRecorder,audioChunks,audioUrl));
      socket.on("ready", () => initiateCall(hostRef, rtcConnectionRef, userStreamRef, socket, roomName, () =>
        createPeerConnection(
          (event) => handleICECandidateEvent(event, socket, roomName),
          (event) => handleTrackEvent(event, peerVideoRef)
        )
      ));
      socket.on("leave", () => onPeerLeave(hostRef, peerVideoRef, rtcConnectionRef));
      socket.on("offer", (offer) => handleReceivedOffer(offer, hostRef, rtcConnectionRef, userStreamRef, socket, roomName, () =>
        createPeerConnection(
          (event) => handleICECandidateEvent(event, socket, roomName),
          (event) => handleTrackEvent(event, peerVideoRef)
        )
      ));
      socket.on('answer', (answer)=>handleAnswer(answer,rtcConnectionRef));
      socket.on('ice-candidate', (incoming) => handlerNewIceCandidateMsg(incoming, rtcConnectionRef));

      return () => {
        socket.disconnect();
      };
    } else {
      console.log("Failed to fetch Socket");
    }
  }, [roomName, socket]);

  const endMeeting = async () => {
    stopAudioRecording(mediaRecorder);
    
    const transcript = `New York (CNN)When Liana Barrientos was 23 years old, she got married in Westchester County, New York.
A year later, she got married again in Westchester County, but to a different man and without divorcing her first husband.
Only 18 days after that marriage, she got hitched yet again. Then, Barrientos declared "I do" five more times, sometimes only within two weeks of each other.
In 2010, she married once more, this time in the Bronx. In an application for a marriage license, she stated it was her "first and only" marriage.
Barrientos, now 39, is facing two criminal counts of "offering a false instrument for filing in the first degree," referring to her false statements on the
2010 marriage license application, according to court documents.
Prosecutors said the marriages were part of an immigration scam.
On Friday, she pleaded not guilty at State Supreme Court in the Bronx, according to her attorney, Christopher Wright, who declined to comment further.
After leaving court, Barrientos was arrested and charged with theft of service and criminal trespass for allegedly sneaking into the New York subway through an emergency exit, said Detective
Annette Markowski, a police spokeswoman. In total, Barrientos has been married 10 times, with nine of her marriages occurring between 1999 and 2002.
All occurred either in Westchester County, Long Island, New Jersey or the Bronx. She is believed to still be married to four men, and at one time, she was married to eight men at once, prosecutors say.
Prosecutors said the immigration scam involved some of her husbands, who filed for permanent residence status shortly after the marriages.
Any divorces happened only after such filings were approved. It was unclear whether any of the men will be prosecuted.
The case was referred to the Bronx District Attorney\'s Office by Immigration and Customs Enforcement and the Department of Homeland Security\'s
Investigation Division. Seven of the men are from so-called "red-flagged" countries, including Egypt, Turkey, Georgia, Pakistan and Mali.
Her eighth husband, Rashid Rajput, was deported in 2006 to his native Pakistan after an investigation by the Joint Terrorism Task Force.
If convicted, Barrientos faces up to four years in prison.  Her next court appearance is scheduled for May 18.`
    try {
      const response = await fetch('http://localhost:4000/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      const data = await response.json();
      const summary_dict = data[0]
      const summary = summary_dict.summary_text
      console.log(summary)
      setSummary(summary);
    } catch (error) {
      console.error('Error summarizing meeting:', error);
    }

    leaveRoom(roomName, userVideoRef, peerVideoRef, rtcConnectionRef, socket, router)
  };

  

  return (
    <div>
      {summary ? <>
        <div className='flex flex-col p-10 '>
          <h3 className='font-bold text-3xl mb-4'>Meeting Summary:</h3>
          <p className='text-lg'>{summary}</p>
          <button className=' mt-4 bg-red-400 text-black rounded-lg p-3 w-40' onClick={() => {router.push("/dashboard")}}>Go to Dashboard</button>
        </div>
      </> : <>
      <div className='flex gap-5 flex-wrap m-4'>
      <video autoPlay ref={screenShareRef} style={{ display: 'none' }} />

      <video autoPlay ref={userVideoRef} />
      <video autoPlay ref={peerVideoRef} />
      </div>
      <button className='mx-4  bg-red-400 text-black rounded-lg p-3' onClick={() => toggleMic(micActive, setMicActive, userStreamRef)} type="button">
        {micActive ? 'Mute Mic' : 'UnMute Mic'}
      </button>
      <button className='mx-4  bg-red-400 text-black rounded-lg p-3' onClick={endMeeting} type="button">
        Leave
      </button>
      <button className='mx-4 bg-red-400 text-black rounded-lg p-3' onClick={() => toggleCamera(cameraActive, setCameraActive, userStreamRef)} type="button">
        {cameraActive ? 'Stop Camera' : 'Start Camera'}
      </button>
      <button className='mx-4 bg-red-400 text-black rounded-lg p-3' onClick={() => handleScreenShare(rtcConnectionRef, userStreamRef, socket, roomName, screenShareRef)} type="button">
        Share Screen
      </button>
      </>}
      
      
    </div>
  );
}
export default Room;