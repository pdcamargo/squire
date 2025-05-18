import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function loadScript(script: string) {
  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script')
    scriptElement.src = script
    scriptElement.onload = () => resolve(true)
    scriptElement.onerror = () => reject(new Error(`Failed to load script: ${script}`))
    document.body.appendChild(scriptElement)
  })
}
