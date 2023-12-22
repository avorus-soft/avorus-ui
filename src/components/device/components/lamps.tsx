import React from 'react'
import styled from 'styled-components'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import { observer } from 'mobx-react-lite'

const LampsContainer = styled.div`
  grid-column: 1 / -1;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: max-content max-content;
`

const Lamps = observer<any>(({ lamps }) => {
  return (
    <LampsContainer>
      {lamps.map((lamp, i) => (
        <>
          {lamp[0] ? (
            <LightbulbIcon key={`lamp_${i}_on`} color="warning" />
          ) : (
            <LightbulbOutlinedIcon key={`lamp_${i}_off`} />
          )}
          <div key={`lamp_${i}_h`}>{lamp[0]} h</div>
        </>
      ))}
    </LampsContainer>
  )
})

export default Lamps
