import { MutableRefObject, Dispatch, SetStateAction } from 'react';
import toggleMediaStream from './toggleMediaStream';

const toggleMic = (
  micActive: boolean,
  setMicActive: Dispatch<SetStateAction<boolean>>,
  userStreamRef: MutableRefObject<MediaStream | null>
) => {
  toggleMediaStream('audio', micActive, userStreamRef);
  setMicActive((prev) => !prev);
};

export default toggleMic;
