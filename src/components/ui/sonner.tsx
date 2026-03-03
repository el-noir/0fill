"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "#111116",
          "--normal-text": "#E5E7EB",
          "--normal-border": "rgba(31, 41, 55, 0.8)", // gray-800
          "--border-radius": "0.375rem",
          "--success-text": "#10B981", // brand primary (emerald)
          "--error-text": "#F87171",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
