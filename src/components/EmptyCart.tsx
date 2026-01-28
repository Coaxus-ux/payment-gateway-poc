import { HiShoppingCart } from 'react-icons/hi'

export function EmptyCart() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
      <div className="w-20 h-20 rounded-full bg-dark/5 flex items-center justify-center mb-6">
        <HiShoppingCart className="w-10 h-10" />
      </div>
      <p className="font-black text-xl tracking-tight mb-1">Bag is empty</p>
      <p className="text-xs font-medium">Add items from the store to proceed.</p>
    </div>
  )
}
