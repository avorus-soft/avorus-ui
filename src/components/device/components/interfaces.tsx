import React from 'react'
import styled from 'styled-components'

export const StyledUl = styled.ul`
  padding: 0;
  margin: 0 0 0 1rem;
`

const Interfaces = ({ interfaces }) => {
  return (
    <StyledUl>
      {interfaces.map(iface => (
        <li key={iface.mac_address}>
          {iface.name} {iface.mac_address}
        </li>
      ))}
    </StyledUl>
  )
}

export default Interfaces
