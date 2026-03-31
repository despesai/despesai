import { Icon } from '@iconify/react'

export function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string
  title: string
  desc: string
}) {
  return (
    <div className="bg-card border-border hover:border-brand-purple/50 group rounded-2xl border p-8 transition-colors">
      <div className="bg-brand-purple/10 mb-6 flex h-12 w-12 items-center justify-center rounded-lg transition-transform group-hover:scale-110">
        <Icon icon={icon} className="text-brand-purple text-2xl" />
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
