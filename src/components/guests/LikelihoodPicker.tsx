'use client'

import { Popover, PopoverButton, PopoverPanel, CloseButton } from '@headlessui/react'
import type { Likelihood } from '@/types'
import { LIKELIHOOD_LABELS } from '@/types'
import StatusDot from '@/components/ui/StatusDot'

const options: Likelihood[] = ['green', 'yellow', 'red']

interface LikelihoodPickerProps {
  current: Likelihood
  onChange: (value: Likelihood) => void
}

export default function LikelihoodPicker({ current, onChange }: LikelihoodPickerProps) {
  return (
    <Popover className="relative">
      <PopoverButton className="cursor-pointer focus:outline-none rounded-full p-1 hover:bg-warm-100 dark:hover:bg-warm-700 transition">
        <StatusDot likelihood={current} />
      </PopoverButton>
      <PopoverPanel
        anchor="bottom start"
        className="z-50 bg-white dark:bg-warm-800 rounded-lg shadow-lg border border-warm-200 dark:border-warm-600 py-1 w-32"
      >
        {options.map((value) => (
          <CloseButton
            key={value}
            as="button"
            onClick={() => onChange(value)}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-warm-50 dark:hover:bg-warm-700 transition cursor-pointer ${
              value === current ? 'bg-warm-50 dark:bg-warm-700/50 font-medium' : ''
            }`}
          >
            <StatusDot likelihood={value} />
            <span className="text-warm-700 dark:text-warm-300">{LIKELIHOOD_LABELS[value]}</span>
          </CloseButton>
        ))}
      </PopoverPanel>
    </Popover>
  )
}
