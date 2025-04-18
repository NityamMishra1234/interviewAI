import { FaceDetector, FilesetResolver } from '@mediapipe/tasks-vision';
interface Landmark {
  x: number;
  y: number;
}

interface Face {
  keypoints: Landmark[];
}

interface DetectionResult {
  detections: Face[];
}
let faceDetector: FaceDetector | null = null;

// Helper function to calculate the angle of rotation between two vectors
const calculateAngle = (prev: { x: number; y: number }, current: { x: number; y: number }): number => {
  const dx = current.x - prev.x;
  const dy = current.y - prev.y;
  return Math.atan2(dy, dx) * (180 / Math.PI); // Return angle in degrees
};

export const initFaceDetection = async (
  videoElement: HTMLVideoElement,
  onFaceDetected: (detections:DetectionResult) => void
) => {
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
  );

  faceDetector = await FaceDetector.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite', // Updated model
      delegate: 'GPU',
    },
    runningMode: 'VIDEO',
    minDetectionConfidence: 0.5,
  });

  let previousLandmarks: { x: number; y: number }[] = []; // Store previous landmarks to compare movements
  let lastDetectedAngle = 0; // Variable to track the last detected angle

  const startDetection = async () => {
    const detect = async () => {
      if (
        !faceDetector ||
        !videoElement ||
        videoElement.videoWidth === 0 ||
        videoElement.videoHeight === 0
      ) {
        requestAnimationFrame(detect); // Keep waiting until video is ready
        return;
      }

      const detections = await faceDetector.detectForVideo(
        videoElement,
        performance.now()
      );

      // Check if detections contains faces, which is usually an array of detected faces
      if (detections && detections.detections && detections.detections.length > 0) {
        const face = detections.detections[0]; // Get the first detected face
        const landmarks = face.keypoints; // Extract landmarks of the face

        // Check if landmarks exist and compare them to detect movement
        if (landmarks && landmarks.length > 0) {
          
          const nose = landmarks[2]; // Example: Assuming the nose landmark is at index 2

          // If it's the first detection, initialize the previous landmarks
          if (previousLandmarks.length === 0) {
            previousLandmarks = landmarks;
            lastDetectedAngle = 0;
            requestAnimationFrame(detect);
            return;
          }

          // Compare the previous and current nose positions to detect movement
          const angle = calculateAngle(previousLandmarks[2], nose); // Calculate the movement angle between the previous and current nose

          // If the angle difference is greater than 2 degrees, it's considered a significant movement
          if (Math.abs(angle - lastDetectedAngle) > 2) {
            console.log(`Detected significant movement: ${angle - lastDetectedAngle} degrees`);
            onFaceDetected(detections); // Trigger face detection callback
            lastDetectedAngle = angle; // Update the last detected angle
          }
        }

        // Update previous landmarks for the next frame
        previousLandmarks = landmarks;
      }

      requestAnimationFrame(detect); // Loop detection
    };

    detect();
  };

  await startDetection();
};
