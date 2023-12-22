import React from 'react'
import styled from 'styled-components'
import CheckIcon from '@mui/icons-material/Check'
import { observer } from 'mobx-react-lite'
import { Error, QuestionMark, Warning } from '@mui/icons-material'

const ErrorsContainer = styled.div`
  grid-column: 1 / -1;
  display: grid;
  column-gap: 0.5rem;
  grid-template-columns: max-content max-content;
`

const ErrorIcon = ({ value }) => {
  switch (value) {
    case 'ok':
      return <CheckIcon color="success" />
    case 'warning':
      return <Warning color="warning" />
    case 'error':
      return <Error color="error" />
    default:
      return <QuestionMark />
  }
}

const Errors = observer<any>(({ errors }) => {
  return (
    <ErrorsContainer>
      {Object.entries(errors).map(([key, value]) => {
        if (value !== null) {
          return (
            <>
              <div key={`${key}_value`}>
                <ErrorIcon value={value} />
              </div>
              <div key={`${key}_key`}>{key}</div>
            </>
          )
        } else {
          return null
        }
      })}
    </ErrorsContainer>
  )
})

export default Errors
