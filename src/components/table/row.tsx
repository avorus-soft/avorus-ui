import React, { memo, useEffect } from 'react'
import { GridRow, GridRowProps } from '@mui/x-data-grid'
import { Tooltip } from '@blueprintjs/core'
import { observer } from 'mobx-react-lite'

const MemoizedRow = memo(GridRow)
export const DraggableRow = observer((props: GridRowProps) => {
  useEffect(() => {
    if (!props.row.status.is_attached) {
      props.row.fetch()
    }
  }, [props.row])

  return (
    <Tooltip hoverOpenDelay={500} content={props.row.name}>
      <MemoizedRow {...props} />
    </Tooltip>
  )
})
