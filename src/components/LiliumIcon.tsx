import React from 'react'

export interface LiliumIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number
}

export default function LiliumIcon({
  size = 18,
  className,
  style,
  alt = 'Lilium logo',
  ...props
}: LiliumIconProps) {
  return (
    <img
      src="/lilium-logo.svg"
      alt={alt}
      width={size}
      height={size}
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle',
        flexShrink: 0,
        ...style,
      }}
      {...props}
    />
  )
}

export { LiliumIcon }
