import { HiMinus, HiPlus } from 'react-icons/hi'

interface QuantitySelectorProps {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}

export function QuantitySelector({ quantity, onIncrement, onDecrement }: QuantitySelectorProps) {
  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDecrement()
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    onIncrement()
  }

  return (
    <div className="flex items-center bg-dark/5 rounded-lg overflow-hidden border border-dark/5">
      <button type="button" onClick={handleDecrement} className="p-1.5 hover:bg-dark/10 transition-colors">
        <HiMinus className="w-3 h-3" />
      </button>
      <span className="w-8 text-center text-xs font-bold">{quantity}</span>
      <button type="button" onClick={handleIncrement} className="p-1.5 hover:bg-dark/10 transition-colors">
        <HiPlus className="w-3 h-3" />
      </button>
    </div>
  )
}
