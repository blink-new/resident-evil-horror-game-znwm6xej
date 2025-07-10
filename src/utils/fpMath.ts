// Project a 3D point (angle, distance) to 2D screen X and scale
export function projectToScreen(angle: number, distance: number) {
  // FOV: 90deg, screen width: 800px
  const fov = Math.PI / 2
  const screenW = 800
  // Clamp angle to FOV
  const maxAngle = fov / 2
  const clamped = Math.max(-maxAngle, Math.min(maxAngle, angle))
  // X: center + (angle / maxAngle) * (screenW/2 * 0.8)
  const x = (clamped / maxAngle) * (screenW / 2 * 0.8)
  // Scale: closer = bigger
  const scale = Math.max(0.3, 1.5 - distance / 400)
  return { x, scale }
}
