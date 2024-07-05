import { MutableRefObject } from 'react';

const handleRoomCreated = (
  userStreamRef: MutableRefObject<MediaStream | null>,
  userVideoRef: MutableRefObject<HTMLVideoElement | null>,
  hostRef: MutableRefObject<boolean>
) => {
  hostRef.current = true;
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: { width: 500, height: 500 },
    })
    .then((stream) => {
      userStreamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
        userVideoRef.current.onloadedmetadata = () => {
          userVideoRef.current?.play();
        };
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

export default handleRoomCreated;
