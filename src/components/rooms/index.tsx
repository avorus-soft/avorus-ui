import React, { useMemo, useRef } from 'react'
import { CardHeader, Paper } from '@mui/material'
import { values } from 'mobx'
import { MosaicWindow } from 'react-mosaic-component'
import { useStores } from '../../models'
import { Location } from '../../models/DataStore/Location'
import { useSize } from '../../hooks/useSize'
import { observer } from 'mobx-react-lite'
import { MasonryScroller, useContainerPosition, usePositioner } from 'masonic'
import Room from './room'

const Floor = ({ parentName, locations }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const size = useSize(containerRef)
  const { offset } = useContainerPosition(containerRef, [size])
  const positioner = usePositioner({
    width: size?.width,
    columnWidth: 130,
    columnGutter: 20,
    rowGutter: 20,
  })

  return (
    <div ref={containerRef} style={{ minWidth: '150px' }}>
      <CardHeader title={parentName} sx={{ paddingTop: 0 }} />
      <MasonryScroller
        height={size?.height}
        offset={offset}
        positioner={positioner}
        items={locations}
        render={Room}
        tabIndex={null}
      />
    </div>
  )
}

const Rooms = ({ path }) => {
  const windowRef = useRef(null)
  const size = useSize(windowRef)
  const { dataStore } = useStores()
  const locations = useMemo<ReadonlyArray<Location>>(
    (): ReadonlyArray<any> =>
      values(dataStore.locations)
        .filter((location: any) =>
          location.data.tags.find(tag => tag.data.description === 'E-Nummer'),
        )
        .filter((location: any) => !!location.data.parent)
        .sort((a: any, b: any) => a.data.name.localeCompare(b.data.name)),
    [dataStore.locations],
  )

  const locationMap = useMemo(() => {
    const parents = locations
      .map(({ data }) => data.parent.name)
      .reduce((acc, val) => ({ ...acc, [val]: [] }), {})
    return locations.reduce(
      (acc, val) => ({
        ...acc,
        [val.data.parent.name]: [...acc[val.data.parent.name], val],
      }),
      parents,
    )
  }, [locations])

  const flexDirection = useMemo(() => {
    if (size?.width < 680) {
      return 'row'
    } else {
      return 'column'
    }
  }, [size?.width])

  return (
    <MosaicWindow title="Rooms" path={path}>
      <Paper
        sx={{
          height: '100%',
          width: '100%',
          minWidth: '280px',
          padding: '1rem .5rem .5rem .5rem',
          overflow: 'auto',
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection,
          gap: '20px',
        }}
        ref={windowRef}
      >
        {Object.keys(locationMap)
          .sort()
          .map(parentName => (
            <Floor
              key={parentName}
              parentName={parentName}
              locations={locationMap[parentName]}
            />
          ))}
      </Paper>
    </MosaicWindow>
  )
}

export default observer(Rooms)
