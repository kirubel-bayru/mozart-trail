/** Scramble a 4-letter word deterministically (display only). */
export function scrambleWord(word: string, seed: string): string {
  const letters = word.toUpperCase().split('')
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  const arr = [...letters]
  for (let i = arr.length - 1; i > 0; i--) {
    hash = (hash * 1103515245 + 12345) | 0
    const j = Math.abs(hash) % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join(' · ')
}
