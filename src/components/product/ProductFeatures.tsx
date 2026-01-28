import { HiCube, HiLightningBolt } from 'react-icons/hi'

const FEATURES = [
  {
    icon: HiCube,
    title: 'Architecture',
    description: 'Next-gen neural processing cores.',
  },
  {
    icon: HiLightningBolt,
    title: 'Efficiency',
    description: 'Zero-latency data synchronization.',
  },
]

export function ProductFeatures() {
  return (
    <div className="grid grid-cols-2 gap-6 mb-12 detail-anim">
      {FEATURES.map((feature) => (
        <div key={feature.title} className="p-6 bg-dark/5 rounded-4xl border border-dark/5">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 text-primary">
            <feature.icon className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-dark mb-1">{feature.title}</h4>
          <p className="text-xs text-dark/40">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
