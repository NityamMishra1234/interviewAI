import { useEffect, useRef, useState } from 'react';
import { initFaceDetection } from '@/utils/mediapipeFace';

type Props = {
  onWarning?: (warned: boolean) => void;
  hideVideo?: boolean;
};

export default function FaceMonitor({ onWarning, hideVideo }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoEl = videoRef.current;
        if (!videoEl) return;

        videoEl.srcObject = stream;

        await initFaceDetection(videoEl, (detections) => {
          const detection = detections.detections?.[0];
          if (!detection) return;

          const landmarks = detection.keypoints;
          if (!landmarks) return;

          // Example of how to access specific landmarks (e.g., nose tip, eyes)
          const noseTip = landmarks[2];  // Assuming landmark 2 is the nose tip (check based on model)
          const leftEye = landmarks[1];  // Left eye (example, check landmark index)

          // Example logic based on landmarks, not boundingBox
          const isLookingDown = noseTip.y > 0.55;  // Assuming y value indicates vertical position
          const isTurned = leftEye.x < 0.1 || leftEye.x > 0.9;  // Example of checking if eyes are turned

          const isBadPose = isLookingDown || isTurned;

          if (isBadPose) {
            if (!warningTimeoutRef.current) {
              warningTimeoutRef.current = setTimeout(() => {
                setWarning(true);
                onWarning?.(true);
              }, 2000); // wait 2 seconds before showing warning
            }
          } else {
            if (warningTimeoutRef.current) {
              clearTimeout(warningTimeoutRef.current);
              warningTimeoutRef.current = null;
            }
            if (warning) {
              setWarning(false);
              onWarning?.(false);
            }
          }
        });
      } catch (err) {
        console.error('⚠️ Failed to access webcam:', err);
      }
    };

    setup();

    return () => {
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, [onWarning, warning]);

  return (
    <div className="relative flex flex-col items-center">
      {!hideVideo && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="rounded-xl w-[320px] h-[240px] border-4 border-gray-700"
        />
      )}

      {warning && (
        <div className="absolute bottom-[-3rem] px-4 py-2 bg-red-500 text-white rounded-xl font-semibold text-sm shadow-lg animate-bounce">
          ⚠️ Please keep your head up and face forward
        </div>
      )}
    </div>
  );
}
