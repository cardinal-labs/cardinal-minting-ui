import { css } from '@emotion/react'
import type { Placement } from '@popperjs/core'
import React, { useEffect, useRef, useState } from 'react'

export interface PopoverProps {
  content: React.ReactNode
  open: boolean
  guide?: boolean
  children: React.ReactNode
  placement?: Placement
  offset?: [number, number]
}

export const Popover: React.FC<PopoverProps> = ({ content, children }) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleClickOutside = (event: { target: any }) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      <div
        className={`absolute -right-2 top-12 z-50 justify-center bg-light-0 bg-opacity-[0.05] transition-all duration-200 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        // eslint-disable-next-line react/no-unknown-property
        css={css`
          ${isOpen
            ? 'opacity: 100; backdrop-filter: blur(15px);'
            : 'opacity: 0; backdrop-filter: blur(0px);'}
        `}
      >
        {content}
      </div>
    </div>
  )
}

export const PopoverItem = ({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) => (
  <div
    className={`${className} rounded-md px-2 py-1 hover:bg-[rgba(255,255,255,0.1)]`}
  >
    {children}
  </div>
)
