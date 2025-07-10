import { motion } from 'framer-motion'

export function PlayerGun({ shooting }: { shooting: boolean }) {
  // Animate gun recoil when shooting
  return (
    <motion.div
      className="absolute left-1/2 bottom-0 z-40 pointer-events-none"
      style={{ transform: 'translateX(-50%)' }}
      animate={{ y: shooting ? 20 : 0, rotate: shooting ? -8 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {/* Gun sprite (simple stylized shape) */}
      <div className="relative w-32 h-32 flex flex-col items-center">
        {/* Hand */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full border-4 border-yellow-600 z-10" />
        {/* Gun body */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-20 h-12 bg-gray-800 rounded-b-2xl border-4 border-gray-900 z-20 shadow-lg" />
        {/* Gun barrel */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-4 h-10 bg-gray-700 rounded-t-lg border-2 border-gray-900 z-30" />
        {/* Muzzle flash */}
        {shooting && (
          <motion.div
            className="absolute bottom-24 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-300 rounded-full opacity-80 blur-md z-40"
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: [1.2, 1.6, 1], opacity: [1, 0.5, 0] }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>
    </motion.div>
  )
}
