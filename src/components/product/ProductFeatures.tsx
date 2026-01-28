import { HiCube, HiLightningBolt } from 'react-icons/hi'

const FEATURES = [
  {
    icon: HiCube,
    iconBg: 'bg-primary',
    iconShadow: 'shadow-primary/20',
    iconColor: 'text-white',
    title: 'Engineered',
    description: 'Precision-tuned for the most demanding environments.',
  },
  {
    icon: HiLightningBolt,
    iconBg: 'bg-accent',
    iconShadow: 'shadow-accent/20',
    iconColor: 'text-dark',
    title: 'Dynamic',
    description: 'Real-time adaptive sensors adjust to your lifestyle.',
  },
]

export function ProductFeatures() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16 detail-fade">
      {FEATURES.map((feature) => (
        <div
          key={feature.title}
          className="p-8 bg-white/40 backdrop-blur-xl rounded-[40px] border border-white/60 shadow-sm group hover:bg-white/60 transition-colors"
        >
          <div
            className={`w-12 h-12 ${feature.iconBg} ${feature.iconColor} rounded-2xl shadow-lg ${feature.iconShadow} flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}
          >
            <feature.icon className="w-6 h-6" />
          </div>
          <h4 className="font-black text-dark text-lg mb-2">{feature.title}</h4>
          <p className="text-sm text-dark/50 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
