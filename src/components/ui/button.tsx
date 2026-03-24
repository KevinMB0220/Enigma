import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-[11px] font-black uppercase tracking-[0.2em] transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-flare-accent/30 focus-visible:ring-[2px]",
  {
    variants: {
      variant: {
        default: 'bg-flare-accent text-flare-bg hover:opacity-90 shadow-[0_0_15px_rgba(74,222,128,0.2)]',
        destructive:
          'bg-[#FB7185] text-white hover:bg-[#FB7185]/90',
        outline:
          'border border-white/10 bg-black/20 hover:bg-white/5 hover:text-flare-text-h text-flare-text-l',
        secondary:
          'bg-black/40 text-flare-text-l hover:bg-black/60',
        ghost:
          'hover:bg-white/5 hover:text-flare-text-h text-flare-text-l',
        link: 'text-flare-accent underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-8 py-2',
        sm: 'h-8 px-4 py-1.5',
        lg: 'h-12 px-12 py-3',
        icon: 'size-10',
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
