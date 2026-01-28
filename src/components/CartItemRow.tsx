import { useCallback } from 'react'
import { HiTrash, HiDotsVertical } from 'react-icons/hi'
import type { CartItem } from '@/types'
import { useSwipeToDelete } from '@/hooks'
import { QuantitySelector } from './QuantitySelector'
import { formatCurrency } from '@/utils/pricing'

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (id: string, delta: number) => void
  onRemove: (id: string) => void
}

export function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  const handleDelete = useCallback(() => {
    onRemove(item.id)
  }, [item.id, onRemove])

  const rowRef = useSwipeToDelete({ onDelete: handleDelete })

  const handleIncrement = () => onUpdateQuantity(item.id, 1)
  const handleDecrement = () => onUpdateQuantity(item.id, -1)

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-red-500">
      <div className="absolute inset-0 flex items-center justify-end px-6 pointer-events-none">
        <div className="flex flex-col items-center gap-1 text-white">
          <HiTrash className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase">Delete</span>
        </div>
      </div>

      <div ref={rowRef} className="relative bg-white p-4 flex gap-4 items-center z-10 border border-dark/5 rounded-2xl touch-pan-y">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark/5 shrink-0 border border-dark/5 shadow-sm">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
        <div className="grow">
          <h4 className="font-bold text-dark text-sm leading-tight mb-1 truncate max-w-30">{item.name}</h4>
          <p className="text-primary font-black text-sm mb-2">{formatCurrency(item.price, item.currency)}</p>
          <QuantitySelector quantity={item.quantity} onIncrement={handleIncrement} onDecrement={handleDecrement} />
        </div>

        <HiDotsVertical className="w-4 h-4 opacity-20" />
      </div>
    </div>
  )
}
