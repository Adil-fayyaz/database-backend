/**
 * WEBRTC CONFIGURATION FOR VOICE/VIDEO CALLS
 * 
 * This file provides production-ready WebRTC configuration with:
 * - Public STUN servers for NAT traversal
 * - TURN server configuration (add your own for production)
 * - ICE candidate gathering optimization
 * - Media constraints for audio/video
 * 
 * Usage:
 * 
 * import { rtcConfig, createPeerConnection, getMediaStream } from './webrtc-config';
 * 
 * const pc = createPeerConnection((candidate) => {
 *   // Send candidate to remote peer via Socket.IO
 *   socket.emit('call:ice-candidate', { targetId, candidate });
 * });
 * 
 * const stream = await getMediaStream('video'); // or 'audio'
 */

// WebRTC Configuration with public STUN servers
const rtcConfig = {
  iceServers: [
    // Google's public STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    
    // Twilio's public STUN server
    { urls: 'stun:global.stun.twilio.com:3478' },
    
    // Mozilla's public STUN server
    { urls: 'stun:stun.services.mozilla.com' },
    
    /**
     * TURN servers (for production, add your own)
     * TURN is needed when direct peer-to-peer connection fails
     * 
     * Free TURN server options:
     * 1. Twilio (https://www.twilio.com/stun-turn)
     * 2. Metered.ca (https://www.metered.ca/tools/openrelay/)
     * 3. Xirsys (https://xirsys.com/)
     * 
     * Example TURN configuration:
     */
    // {
    //   urls: 'turn:your-turn-server.com:3478',
    //   username: 'your-username',
    //   credential: 'your-password'
    // },
    
    // Open Relay TURN server (free, but limited - use your own in production)
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject'
    }
  ],
  
  // ICE candidate gathering policy
  iceTransportPolicy: 'all', // Use 'relay' to force TURN usage
  
  // Bundle policy for better performance
  bundlePolicy: 'max-bundle',
  
  // RTCP Mux policy
  rtcpMuxPolicy: 'require',
  
  // ICE candidate pool size
  iceCandidatePoolSize: 10
};

// Media constraints for audio calls
const audioConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000,
    channelCount: 1
  },
  video: false
};

// Media constraints for video calls
const videoConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000
  },
  video: {
    width: { ideal: 1280, max: 1920 },
    height: { ideal: 720, max: 1080 },
    frameRate: { ideal: 30, max: 60 },
    facingMode: 'user' // Use 'environment' for rear camera
  }
};

// Screen sharing constraints
const screenConstraints = {
  audio: false,
  video: {
    cursor: 'always',
    displaySurface: 'monitor'
  }
};

/**
 * Create a peer connection with ICE candidate callback
 * @param {Function} onIceCandidate - Callback for ICE candidates
 * @param {Function} onTrack - Callback for remote tracks
 * @returns {RTCPeerConnection}
 */
function createPeerConnection(onIceCandidate, onTrack) {
  const pc = new RTCPeerConnection(rtcConfig);
  
  // Handle ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('🧊 New ICE candidate:', event.candidate.type);
      if (onIceCandidate) {
        onIceCandidate(event.candidate);
      }
    } else {
      console.log('✅ ICE candidate gathering complete');
    }
  };
  
  // Handle connection state changes
  pc.onconnectionstatechange = () => {
    console.log('🔄 Connection state:', pc.connectionState);
    
    switch (pc.connectionState) {
      case 'connected':
        console.log('✅ Peer connection established');
        break;
      case 'disconnected':
        console.log('⚠️ Peer connection disconnected');
        break;
      case 'failed':
        console.log('❌ Peer connection failed');
        // Attempt to reconnect
        pc.restartIce();
        break;
      case 'closed':
        console.log('❌ Peer connection closed');
        break;
    }
  };
  
  // Handle ICE connection state
  pc.oniceconnectionstatechange = () => {
    console.log('🧊 ICE connection state:', pc.iceConnectionState);
    
    if (pc.iceConnectionState === 'failed') {
      console.log('❌ ICE connection failed, restarting ICE...');
      pc.restartIce();
    }
  };
  
  // Handle remote tracks
  pc.ontrack = (event) => {
    console.log('📺 Received remote track:', event.track.kind);
    if (onTrack) {
      onTrack(event);
    }
  };
  
  // Handle negotiation needed
  pc.onnegotiationneeded = () => {
    console.log('🔄 Negotiation needed');
  };
  
  return pc;
}

/**
 * Get media stream (audio/video/screen)
 * @param {string} type - 'audio', 'video', or 'screen'
 * @returns {Promise<MediaStream>}
 */
async function getMediaStream(type = 'audio') {
  try {
    let constraints;
    
    switch (type) {
      case 'audio':
        constraints = audioConstraints;
        break;
      case 'video':
        constraints = videoConstraints;
        break;
      case 'screen':
        // Screen sharing uses different API
        return await navigator.mediaDevices.getDisplayMedia(screenConstraints);
      default:
        throw new Error(`Unknown media type: ${type}`);
    }
    
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    console.log(`✅ Got ${type} stream with ${stream.getTracks().length} tracks`);
    return stream;
    
  } catch (error) {
    console.error(`❌ Error getting ${type} stream:`, error);
    
    // Handle specific errors
    if (error.name === 'NotAllowedError') {
      throw new Error('Permission denied. Please allow camera/microphone access.');
    } else if (error.name === 'NotFoundError') {
      throw new Error('No camera/microphone found on this device.');
    } else if (error.name === 'NotReadableError') {
      throw new Error('Camera/microphone is already in use by another application.');
    } else {
      throw error;
    }
  }
}

/**
 * Create and send offer
 * @param {RTCPeerConnection} pc - Peer connection
 * @param {Function} sendOffer - Callback to send offer
 */
async function createAndSendOffer(pc, sendOffer) {
  try {
    const offer = await pc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true
    });
    
    await pc.setLocalDescription(offer);
    console.log('✅ Created and set local offer');
    
    if (sendOffer) {
      sendOffer(offer);
    }
    
    return offer;
  } catch (error) {
    console.error('❌ Error creating offer:', error);
    throw error;
  }
}

/**
 * Handle incoming offer and create answer
 * @param {RTCPeerConnection} pc - Peer connection
 * @param {RTCSessionDescriptionInit} offer - Remote offer
 * @param {Function} sendAnswer - Callback to send answer
 */
async function handleOfferAndCreateAnswer(pc, offer, sendAnswer) {
  try {
    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    console.log('✅ Set remote offer');
    
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    console.log('✅ Created and set local answer');
    
    if (sendAnswer) {
      sendAnswer(answer);
    }
    
    return answer;
  } catch (error) {
    console.error('❌ Error handling offer:', error);
    throw error;
  }
}

/**
 * Handle incoming answer
 * @param {RTCPeerConnection} pc - Peer connection
 * @param {RTCSessionDescriptionInit} answer - Remote answer
 */
async function handleAnswer(pc, answer) {
  try {
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('✅ Set remote answer');
  } catch (error) {
    console.error('❌ Error handling answer:', error);
    throw error;
  }
}

/**
 * Add ICE candidate
 * @param {RTCPeerConnection} pc - Peer connection
 * @param {RTCIceCandidateInit} candidate - ICE candidate
 */
async function addIceCandidate(pc, candidate) {
  try {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
    console.log('✅ Added ICE candidate');
  } catch (error) {
    console.error('❌ Error adding ICE candidate:', error);
  }
}

/**
 * Stop all tracks in a stream
 * @param {MediaStream} stream - Media stream
 */
function stopStream(stream) {
  if (stream) {
    stream.getTracks().forEach(track => {
      track.stop();
      console.log(`🛑 Stopped ${track.kind} track`);
    });
  }
}

/**
 * Close peer connection
 * @param {RTCPeerConnection} pc - Peer connection
 */
function closePeerConnection(pc) {
  if (pc) {
    pc.close();
    console.log('🛑 Closed peer connection');
  }
}

/**
 * Check browser WebRTC support
 * @returns {Object} Support status
 */
function checkWebRTCSupport() {
  const support = {
    getUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    RTCPeerConnection: !!window.RTCPeerConnection,
    getDisplayMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia)
  };
  
  console.log('🔍 WebRTC support:', support);
  return support;
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    rtcConfig,
    audioConstraints,
    videoConstraints,
    screenConstraints,
    createPeerConnection,
    getMediaStream,
    createAndSendOffer,
    handleOfferAndCreateAnswer,
    handleAnswer,
    addIceCandidate,
    stopStream,
    closePeerConnection,
    checkWebRTCSupport
  };
}

if (typeof window !== 'undefined') {
  window.WebRTCConfig = {
    rtcConfig,
    audioConstraints,
    videoConstraints,
    screenConstraints,
    createPeerConnection,
    getMediaStream,
    createAndSendOffer,
    handleOfferAndCreateAnswer,
    handleAnswer,
    addIceCandidate,
    stopStream,
    closePeerConnection,
    checkWebRTCSupport
  };
}



