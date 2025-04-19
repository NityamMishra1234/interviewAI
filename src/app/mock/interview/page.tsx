"use client";

// Only use ONE of these config options, not both
export const dynamic = "force-dynamic"; // Disables static generation
// OR
 // Equivalent to "force-dynamic" but with ISR

// Rename dynamic import to avoid conflicts
import dynamicComponent from "next/dynamic";

const InterviewPage = dynamicComponent(
  () => import("@/components/InterviewComponent"),
  { 
    ssr: false,
    loading: () => <div>Loading interview...</div>
  }
);

export default InterviewPage;