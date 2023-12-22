import { Button } from '@mui/material'
import React, { useCallback } from 'react'
import { useDragLayer } from 'react-dnd'
import { MosaicDragType, MosaicWindow } from 'react-mosaic-component'
import { OptionIcon } from './calendar/items'

const getItemStyles = (initialOffset, currentOffset) => {
  if (!initialOffset || !currentOffset) {
    return {
      display: 'none',
    }
  }
  const { x, y } = currentOffset
  const transform = `translate(${x}px, ${y}px)`
  return {
    transform,
    WebkitTransform: transform,
  }
}

const DragLayer = () => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer(monitor => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }))

  const renderItem = useCallback(() => {
    return (
      <Button
        startIcon={<OptionIcon type={item?.type} />}
        sx={{ cursor: 'grabbing', width: 'max-content' }}
      >
        {item?.label} ({item?.description})
      </Button>
    )
  }, [item?.label, item?.type, item?.description])

  if (!isDragging || itemType === MosaicDragType.WINDOW) {
    return null
  }
  return (
    <div
      style={{
        position: 'absolute',
        zIndex: 100,
        left: 0,
        top: 0,
        width: '0%',
        height: '0%',
      }}
    >
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem()}
      </div>
    </div>
  )
}

export default DragLayer
