import { HiArrowLeft } from 'react-icons/hi'

interface BackButtonProps {
  onClick: () => void
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <nav className="fixed top-27 sm:top-24 left-0 right-0 z-30 px-8 flex justify-between items-center pointer-events-none">
      <button
        type="button"
        onClick={onClick}
        className="pointer-events-auto p-4 sm:p-5 bg-white/40 backdrop-blur-2xl rounded-3xl shadow-elevated border border-white/20 hover:scale-110 active:scale-90 transition-all group"
      >
        <HiArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>
    </nav>
  )
}
