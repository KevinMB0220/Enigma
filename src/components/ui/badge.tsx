import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-none border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 transition-all duration-300 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-flare-accent text-flare-bg [a&]:hover:bg-flare-accent/90 shadow-[0_0_15px_rgba(74,222,128,0.2)]',
        secondary:
          'border-transparent bg-black/40 text-flare-text-l [a&]:hover:bg-black/60',
        destructive:
          'border-transparent bg-[#FB7185]/20 text-[#FB7185] [a&]:hover:bg-[#FB7185]/30',
        outline:
          'border-white/10 text-flare-text-l bg-transparent [a&]:hover:bg-white/5 [a&]:hover:text-flare-text-h',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
