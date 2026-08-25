let audioContext: AudioContext | undefined
let soundEnabled = true

export function isSoundEnabled(): boolean {
  return soundEnabled
}

export function toggleSound(): boolean {
  soundEnabled = !soundEnabled
  return soundEnabled
}

export function playResultSound(correct: boolean): void {
  if (!soundEnabled) return
  try {
    audioContext ??= new AudioContext()
  } catch {
    soundEnabled = false
    return
  }
  const now = audioContext.currentTime
  const notes = correct ? [523.25, 783.99] : [220, 146.83]
  notes.forEach((frequency, index) => {
    const oscillator = audioContext!.createOscillator()
    const gain = audioContext!.createGain()
    const start = now + index * 0.12
    oscillator.type = correct ? 'sine' : 'triangle'
    oscillator.frequency.setValueAtTime(frequency, start)
    gain.gain.setValueAtTime(0.0001, start)
    gain.gain.exponentialRampToValueAtTime(correct ? 0.12 : 0.09, start + 0.015)
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.2)
    oscillator.connect(gain)
    gain.connect(audioContext!.destination)
    oscillator.start(start)
    oscillator.stop(start + 0.21)
  })
}
