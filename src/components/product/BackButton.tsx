import { HiArrowLeft } from 'react-icons/hi'

interface BackButtonProps {
  onClick: () => void
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center pointer-events-none">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto p-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-premium border border-dark/5 hover:scale-105 active:scale-95 transition-all"
      >
        <HiArrowLeft className="w-6 h-6" />
      </button>
    </nav>
  )
}
