const ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
  ],
};

const createPeerConnection = (
  handleICECandidateEvent: (event: RTCPeerConnectionIceEvent) => void,
  handleTrackEvent: (event: RTCTrackEvent) => void
): RTCPeerConnection => {
  const connection = new RTCPeerConnection(ICE_SERVERS);

  connection.onicecandidate = handleICECandidateEvent;
  connection.ontrack = handleTrackEvent;

  return connection;
};

export default createPeerConnection;
