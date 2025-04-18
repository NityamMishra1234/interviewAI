import { useEffect, useRef } from 'react';

const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      })
      .catch((err) => console.error('Webcam error:', err));

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  return videoRef;
};

export default useCamera;
