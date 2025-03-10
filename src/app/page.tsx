"use client"

import dynamic from "next/dynamic"
import ProtectedRoute from "@/components/protected-route"

// Dynamically import the TweetToneCustomizer component to avoid hydration issues
const TweetToneCustomizer = dynamic(() => import("../components/tweet-tone-customizer"), {
  ssr: false,
})

export default function Home() {
  return (
    <ProtectedRoute>
      <TweetToneCustomizer />
    </ProtectedRoute>
  )
}
