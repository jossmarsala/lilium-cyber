import React from 'react'

export interface TulipIconProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  size?: number
}

export default function TulipIcon({
  size = 18,
  className,
  style,
  alt = 'Tulip logo',
  ...props
}: TulipIconProps) {
  return (
    <img
      src="/tulip-logo.svg"
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
