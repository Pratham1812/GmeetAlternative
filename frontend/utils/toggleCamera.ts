import { MutableRefObject, Dispatch, SetStateAction } from 'react';
import toggleMediaStream from './toggleMediaStream';

const toggleCamera = (
  cameraActive: boolean,
  setCameraActive: Dispatch<SetStateAction<boolean>>,
  userStreamRef: MutableRefObject<MediaStream | null>
) => {
  toggleMediaStream('video', cameraActive, userStreamRef);
  setCameraActive((prev) => !prev);
};

export default toggleCamera;
