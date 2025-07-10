import { motion } from 'framer-motion'

export function Room() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Floor pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-20 grid-rows-15 h-full w-full">
          {[...Array(300)].map((_, i) => (
            <div
              key={i}
              className="border-gray-700 border-opacity-20 border-r border-b"
              style={{
                backgroundColor: i % 2 === 0 ? 'rgba(55, 65, 81, 0.3)' : 'rgba(75, 85, 99, 0.3)',
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Room walls */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top wall */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-900 to-gray-800 border-b-2 border-gray-700 shadow-lg" />
        
        {/* Bottom wall */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-gray-800 border-t-2 border-gray-700 shadow-lg" />
        
        {/* Left wall */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-900 to-gray-800 border-r-2 border-gray-700 shadow-lg" />
        
        {/* Right wall */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-900 to-gray-800 border-l-2 border-gray-700 shadow-lg" />
      </div>
      
      {/* Environmental decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Scattered debris */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-gray-700 rounded-sm transform rotate-12 opacity-60" />
        <div className="absolute top-32 left-64 w-2 h-2 bg-gray-600 rounded-sm transform -rotate-6 opacity-50" />
        <div className="absolute top-48 left-32 w-3 h-3 bg-gray-700 rounded-sm transform rotate-45 opacity-40" />
        <div className="absolute bottom-32 right-48 w-5 h-2 bg-gray-700 rounded-sm transform -rotate-12 opacity-60" />
        <div className="absolute bottom-48 right-32 w-2 h-4 bg-gray-600 rounded-sm transform rotate-30 opacity-50" />
        
        {/* Blood stains */}
        <div className="absolute top-40 left-80 w-6 h-6 bg-red-900 rounded-full opacity-30 blur-sm" />
        <div className="absolute top-56 left-96 w-4 h-4 bg-red-800 rounded-full opacity-25 blur-sm" />
        <div className="absolute bottom-40 right-80 w-8 h-8 bg-red-900 rounded-full opacity-20 blur-sm" />
        
        {/* Cracks in the floor */}
        <div className="absolute top-1/2 left-1/4 w-32 h-0.5 bg-gray-600 transform -rotate-12 opacity-30" />
        <div className="absolute top-1/3 right-1/4 w-24 h-0.5 bg-gray-600 transform rotate-6 opacity-25" />
      </div>
      
      {/* Ambient lighting effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Flickering lights */}
        <motion.div
          className="absolute top-16 left-1/4 w-24 h-24 bg-yellow-400 rounded-full opacity-10 blur-3xl"
          animate={{
            opacity: [0.05, 0.15, 0.05],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-16 right-1/4 w-32 h-32 bg-red-400 rounded-full opacity-5 blur-3xl"
          animate={{
            opacity: [0.02, 0.08, 0.02],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        <motion.div
          className="absolute bottom-16 left-1/2 w-20 h-20 bg-blue-400 rounded-full opacity-8 blur-3xl"
          animate={{
            opacity: [0.03, 0.12, 0.03],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </div>
  )
}