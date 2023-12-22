import React, { useMemo, memo } from 'react'
import { Mermaid } from '../../mermaid-wrapper'

declare global {
  interface Window {
    callback: CallableFunction
  }
}

type MermaidNode = {
  nodeId?: string
  nodeName?: string
}

const makePowerPortId = ({ id }) => `powerPort_${id}`
const makePowerFeedId = ({ power_panel, name }) =>
  `powerFeed_${power_panel.name}_${name}`

const PDU = ({ name: deviceName, power_ports = [] }) => {
  const psus = useMemo(() => {
    const psus: Map<number, MermaidNode> = new Map()
    power_ports.forEach(({ name, label, id }) => {
      psus[id] = {
        nodeId: makePowerPortId({ id }),
        nodeName: `${name.replace('(', ' ').replace(')', ' ')} ${label}`,
      }
    })
    return psus
  }, [power_ports])

  const pdus = useMemo(() => {
    const pdus: Map<string, Map<number, MermaidNode>> = new Map()
    power_ports.forEach(({ link_peers }) => {
      link_peers.forEach(({ name, power_panel }) => {
        const node = {
          nodeId: makePowerFeedId({ name, power_panel }),
          nodeName: `Feed ${name}`,
        }
        if (!pdus[power_panel.name]) {
          pdus[power_panel.name] = new Map()
        }
        pdus[power_panel.name][name] = node
      })
    })
    return pdus
  }, [power_ports])

  const connections = useMemo(() => {
    const connections = []
    power_ports.forEach(({ id, link_peers }) => {
      connections.push(
        link_peers.map(({ name, power_panel }) => [
          makePowerFeedId({ power_panel, name }),
          makePowerPortId({ id }),
        ]),
      )
    })
    return connections
  }, [power_ports])

  const content = useMemo(() => {
    try {
      return `flowchart TD
  subgraph ${deviceName}
  ${Object.values(psus)
    .map(({ nodeId, nodeName }) => `${nodeId}[${nodeName}]`)
    .join('\n  ')}
  end
  ${Object.entries(pdus)
    .map(
      ([pduName, feeds]) => `
  subgraph ${pduName}
  ${Object.values(feeds)
    ?.map(({ nodeId, nodeName }) => `${nodeId}[${nodeName}]`)
    .join('\n  ')}
  end
  `,
    )
    .join('\n  ')}
  ${connections?.map(([[from, to]]) => `${from} --> ${to}`).join('\n  ')}
`
    } catch (e) {
      console.error(e)
      return `flowchart TD
  subgraph ${deviceName}
  ${Object.values(psus)
    .map(({ nodeId, nodeName }) => `${nodeId}[${nodeName}]`)
    .join('\n  ')}
  end
`
    }
  }, [pdus, psus, connections, deviceName])

  return <Mermaid>{content}</Mermaid>
}

export default memo(PDU)
