import React from 'react'
import Image from 'next/image'

interface AvatarProps {
  name?: string
  email?: string
  imageSrc?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-12 h-12 text-lg',
  lg: 'w-16 h-16 text-2xl',
  xl: 'w-20 h-20 text-3xl'
}

function getInitials(name?: string) {
  if (!name) return '👤'
  return name
    .split(' ')
    .map(n => n.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

function getColorFromName(name?: string) {
  if (!name) return 'bg-gray-400'
  const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-indigo-500', 'bg-cyan-500']
  const charCode = name.charCodeAt(0)
  return colors[charCode % colors.length]
}

export function Avatar({ name, email, imageSrc, size = 'md', className = '' }: AvatarProps) {
  const sizeClass = sizeClasses[size]
  const initials = getInitials(name)
  const color = getColorFromName(name)

  if (imageSrc) {
    return (
      <div className={`${sizeClass} relative rounded-full overflow-hidden ${className}`}>
        <Image
          src={imageSrc}
          alt={name || 'Avatar'}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div
      className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}
      title={`${name || 'Unknown'} ${email ? '(' + email + ')' : ''}`}
    >
      {initials}
    </div>
  )
}

export default Avatar
