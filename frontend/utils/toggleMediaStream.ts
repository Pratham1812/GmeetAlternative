import { MutableRefObject } from 'react';

const toggleMediaStream = (type: 'audio' | 'video', state: boolean, userStreamRef: MutableRefObject<MediaStream | null>) => {
  userStreamRef.current?.getTracks().forEach((track) => {
    if (track.kind === type) {
      track.enabled = !state;
    }
  });
};

export default toggleMediaStream;
