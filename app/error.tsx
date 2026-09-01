'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#070b14] text-white">
      <h2 className="text-xl font-bold mb-2">Xatolik yuz berdi</h2>
      <p className="text-gray-400 mb-6 text-sm">Iltimos, qayta urinib ko&apos;ring</p>
      <button
        type="button"
        onClick={() => reset()}
        className="px-5 py-2.5 rounded-full bg-[#ffb703] text-black font-bold text-xs"
      >
        Qayta urinish
      </button>
    </div>
  )
}
