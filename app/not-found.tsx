import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-[#070b14] text-white">
      <h2 className="text-2xl font-bold mb-2">Sahifa topilmadi</h2>
      <p className="text-gray-400 mb-6 text-sm">Kechirasiz, siz qidirayotgan sahifa mavjud emas.</p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-full bg-[#ffb703] text-black font-bold text-xs"
      >
        Bosh sahifaga qaytish
      </Link>
    </div>
  )
}
