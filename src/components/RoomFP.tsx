import { motion } from 'framer-motion'

export function RoomFP({ yaw }: { yaw: number }) {
  // Simulate a corridor with a simple perspective effect
  // The background shifts left/right as the player looks around
  const bgX = Math.sin(yaw) * 40
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Corridor walls */}
      <motion.div
        className="absolute left-1/2 top-0 w-[120vw] h-full -translate-x-1/2"
        style={{ x: bgX }}
      >
        <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-gray-900 to-transparent" />
        <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-gray-900 to-transparent" />
        <div className="absolute left-1/3 top-0 w-1/3 h-full bg-gray-800/60 border-x-4 border-gray-700" />
      </motion.div>
      {/* Floor */}
      <div className="absolute left-0 right-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-900/90 to-transparent" />
      {/* Ceiling */}
      <div className="absolute left-0 right-0 top-0 h-1/4 bg-gradient-to-b from-gray-900/80 to-transparent" />
      {/* Flickering light */}
      <motion.div
        className="absolute top-0 left-1/2 w-32 h-32 bg-yellow-200 rounded-full opacity-10 blur-3xl -translate-x-1/2"
        animate={{ opacity: [0.08, 0.18, 0.08] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </div>
  )
}
