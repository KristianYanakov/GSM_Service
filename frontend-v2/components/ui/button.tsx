import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xl border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-0 active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45 data-disabled:pointer-events-none data-disabled:opacity-45 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4.5",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-[0_6px_16px_-6px_rgb(233_69_96/0.6)] hover:bg-[#d63a54] active:bg-[#bf3049]',
        navy: 'bg-navy text-navy-foreground hover:bg-navy/90 active:bg-navy/80',
        outline:
          'border-navy/20 bg-card text-navy hover:border-navy/40 hover:bg-secondary active:bg-secondary/80',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/70 active:bg-secondary/60',
        ghost: 'text-navy hover:bg-secondary active:bg-secondary/80',
        destructive:
          'bg-destructive/10 text-destructive hover:bg-destructive/15 focus-visible:ring-destructive/20',
        link: 'h-auto rounded-md px-0 text-primary underline-offset-4 hover:underline active:opacity-80 [&]:shadow-none',
      },
      size: {
        default: 'h-11 gap-2 px-5 text-[15px]',
        sm: 'h-9 gap-1.5 rounded-lg px-3.5 text-sm',
        lg: 'h-12 gap-2 px-6 text-base md:h-13',
        xl: 'h-14 gap-2.5 px-7 text-base',
        icon: 'size-11',
        'icon-sm': 'size-9 rounded-lg',
        'icon-lg': 'size-12',
        'icon-xs': 'size-7 rounded-md',
        xs: 'h-7 gap-1 rounded-md px-2 text-xs',
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
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
