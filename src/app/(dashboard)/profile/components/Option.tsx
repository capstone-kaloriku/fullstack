import { SettingsProps } from '@/types'
import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'

function Options({ data }: SettingsProps) {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 w-full gap-3 my-6">
      {data.map((item) => (
        <Link
          href={item.url}
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-muted/10 bg-surface p-4"
        >
          <div className="flex flex-row items-center gap-3">
            {item.icon}
            <div className="flex flex-col items-start justify-center">
              <span className="text-lg font-bold">{item.title}</span>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <ArrowRightIcon className="text-primary" />
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Options