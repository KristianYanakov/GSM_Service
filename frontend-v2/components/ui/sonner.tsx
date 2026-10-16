"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-success" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5 text-warning" />,
        error: <OctagonXIcon className="size-5 text-destructive" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--navy)",
          "--normal-text": "var(--navy-foreground)",
          "--normal-border": "var(--navy)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "!font-sans !rounded-2xl !p-4 !gap-3 !shadow-lift",
          title: "!text-[15px] !font-semibold",
          description: "!text-sm !text-navy-foreground/70",
          actionButton:
            "!h-9 !rounded-lg !bg-primary !px-3 !text-sm !font-semibold !text-primary-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
