"use client"

import { useState, useEffect } from "react"
import { Check, Users, Briefcase, Bitcoin, Gamepad2, Music, Camera } from "lucide-react"
import { motion } from "framer-motion"

export type PersonaType = "gen-z" | "corporate" | "crypto" | "gamer" | "artist" | "influencer" | null

interface Persona {
  id: PersonaType
  name: string
  icon: React.ReactNode
  description: string
  color: string
  bgGradient: string
  reaction: string
}

interface AudiencePersonaSimulatorProps {
  onPersonaSelect: (persona: PersonaType) => void
  selectedPersona: PersonaType
}

export function AudiencePersonaSimulator({ onPersonaSelect, selectedPersona }: AudiencePersonaSimulatorProps) {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])
  
  const personas: Persona[] = [
    {
      id: "gen-z",
      name: "Gen Z Meme Lords",
      icon: <Gamepad2 className="h-5 w-5" />,
      description: "Ironic humor, slang, and internet culture references",
      color: "from-green-400 to-green-600",
      bgGradient: "bg-gradient-to-r from-green-400/10 to-green-500/10",
      reaction: "LMAO so real 💀"
    },
    {
      id: "corporate",
      name: "Corporate Execs",
      icon: <Briefcase className="h-5 w-5" />,
      description: "Professional tone with business jargon",
      color: "from-blue-800 to-blue-900",
      bgGradient: "bg-gradient-to-r from-blue-800/10 to-blue-900/10",
      reaction: "Excellent insights. Adding to my agenda. 📊"
    },
    {
      id: "crypto",
      name: "Crypto Bros",
      icon: <Bitcoin className="h-5 w-5" />,
      description: "Blockchain enthusiasm with crypto slang",
      color: "from-yellow-400 to-yellow-600",
      bgGradient: "bg-gradient-to-r from-yellow-400/10 to-yellow-600/10",
      reaction: "BULLISH! 🚀🌕 This is the way."
    },
    {
      id: "gamer",
      name: "Gamers",
      icon: <Gamepad2 className="h-5 w-5" />,
      description: "Gaming references and competitive lingo",
      color: "from-purple-500 to-purple-700",
      bgGradient: "bg-gradient-to-r from-purple-500/10 to-purple-700/10",
      reaction: "GG! That's actually OP 🎮"
    },
    {
      id: "artist",
      name: "Creative Types",
      icon: <Music className="h-5 w-5" />,
      description: "Artistic expression and creative terminology",
      color: "from-pink-400 to-purple-500",
      bgGradient: "bg-gradient-to-r from-pink-400/10 to-purple-500/10",
      reaction: "This speaks to my soul ✨🎨"
    },
    {
      id: "influencer",
      name: "Social Influencers",
      icon: <Camera className="h-5 w-5" />,
      description: "Trendy, aspirational content with hashtags",
      color: "from-orange-400 to-pink-500",
      bgGradient: "bg-gradient-to-r from-orange-400/10 to-pink-500/10",
      reaction: "Obsessed with this! 😍 #trending"
    }
  ]

  const getSelectedPersona = () => {
    return personas.find(persona => persona.id === selectedPersona)
  }

  return (
    <div className="w-full space-y-4 font-['Poppins',sans-serif]">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Target Audience</h3>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>Persona Simulator</span>
        </div>
      </div>
      
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {personas.map((persona, index) => (
          <motion.div
            key={persona.id}
            className={`relative cursor-pointer rounded-xl p-3 border-2 transition-all ${
              selectedPersona === persona.id 
                ? `border-accent shadow-lg ${persona.bgGradient}` 
                : "border-border hover:border-accent/50"
            } hover:scale-105`}
            onClick={() => onPersonaSelect(persona.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            {selectedPersona === persona.id && (
              <motion.div 
                className="absolute top-2 right-2 bg-accent rounded-full p-0.5 text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check className="h-3 w-3" />
              </motion.div>
            )}
            
            <div className={`inline-flex items-center justify-center p-2 rounded-lg bg-gradient-to-r ${persona.color} text-white mb-2`}>
              {persona.icon}
            </div>
            
            <div className="font-medium text-sm">{persona.name}</div>
            <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{persona.description}</div>
          </motion.div>
        ))}
      </motion.div>
      
      {selectedPersona && (
        <motion.div 
          className="mt-4 rounded-xl border border-border p-4 bg-gradient-to-r from-blue-50/5 to-white/5"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start gap-3">
            <div className="bg-background rounded-full p-2 border border-border">
              <Users className="h-5 w-5 text-accent" />
            </div>
            <div>
              <div className="font-medium">{getSelectedPersona()?.name} Reaction:</div>
              <motion.div 
                className="text-sm mt-1 text-accent"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {getSelectedPersona()?.reaction}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 