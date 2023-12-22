import React, { useEffect } from 'react'
import mermaid, { MermaidConfig } from 'mermaid'

const DEFAULT_CONFIG: MermaidConfig = {
  startOnLoad: true,
  theme: 'dark',
  logLevel: 'fatal',
  securityLevel: 'loose',
  arrowMarkerAbsolute: false,
  fontFamily: 'IBM Plex Mono',
  flowchart: {
    htmlLabels: true,
    curve: 'linear',
  },
}

mermaid.initialize({ ...DEFAULT_CONFIG })

export const Mermaid = ({ children, ...rest }) => {
  useEffect(() => {
    mermaid.contentLoaded()
  }, [children])

  return (
    <div {...rest} className="mermaid">
      {children}
    </div>
  )
}
