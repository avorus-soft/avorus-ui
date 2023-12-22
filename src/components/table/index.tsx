import React, { memo, useMemo, useState, useCallback, useEffect } from 'react'
import { MosaicWindow, MosaicPath, MosaicNode } from 'react-mosaic-component'
import { Paper, Button, ButtonGroup } from '@mui/material'
import {
  DataGrid,
  GridColumnHeaders,
  useGridApiRef,
  GridFilterModel,
  GridSortModel,
  GridColumnVisibilityModel,
  GridPaginationModel,
  GridToolbar,
  GridRowModel,
  GridColDef,
  GridValidRowModel,
} from '@mui/x-data-grid'

import { load, save } from '../../utils/storage'
import useActions, { actionLabel, ItemType } from '../../hooks/useActions'
import { DraggableRow } from './row'
import { useColumns } from './columns'

import { TagType, LocationType } from '../../services/api'
import { useStores } from '../../models'
import { onSnapshot } from 'mobx-state-tree'
import { Startup } from '../../containers'
import { values } from 'mobx'
import { Device } from '../../models/DataStore'
import { Tag } from '../../models/DataStore/Tag'
import { Location } from '../../models/DataStore/Location'
import { columnVisibility } from './columnVisibility'
import { useThrottle } from '../../hooks/useThrottle'

const MemoizedColumnHeaders = memo(GridColumnHeaders)

type TableVariant = 'devices' | 'tags' | 'locations'

export interface TableProps {
  path: MosaicPath
  node: MosaicNode<string>
  variant?: TableVariant
  filterVariant?: 'tag' | 'location' | null
  filter?: TagType | LocationType | null
  modelKey: string
}

const Table = ({
  variant,
  rows,
  columns,
  setSelectedRows,
  modelKey,
}: {
  path: MosaicPath
  node: MosaicNode<string>
  variant: TableVariant
  rows: Array<GridValidRowModel>
  columns: Array<GridColDef<Device | Tag | Location>>
  setSelectedRows: CallableFunction
  modelKey: string
}) => {
  const { dataStore } = useStores()
  const apiRef = useGridApiRef()
  const [isLoading, setIsLoading] = useState(true)

  const [filterModel, setFilterModel] = useState<GridFilterModel>(null)

  const onRowSelectionModelChange = useCallback(
    (ids: Array<string>) => {
      setSelectedRows(
        rows.filter(({ id }) => !!ids.find(_id => Number(_id) === id)),
      )
    },
    [rows, setSelectedRows],
  )
  const [sortModel, setSortModel] = useState<GridSortModel>(null)
  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(null)
  const [paginationModel, setPaginationModel] =
    useState<GridPaginationModel>(null)

  useEffect(() => {
    if (filterModel !== null) {
      save(`filterModel.${modelKey}`, filterModel)
    }
  }, [modelKey, filterModel])

  useEffect(() => {
    if (sortModel !== null) {
      save(`sortModel.${modelKey}`, sortModel)
    }
  }, [modelKey, sortModel])

  useEffect(() => {
    if (columnVisibilityModel !== null) {
      save(`columnVisibilityModel.${modelKey}`, columnVisibilityModel)
    }
  }, [modelKey, columnVisibilityModel])

  useEffect(() => {
    if (paginationModel !== null) {
      save(`paginationModel.${modelKey}`, paginationModel)
    }
  }, [modelKey, paginationModel])

  useEffect(() => {
    const fn = async () => {
      const _filterModel = await load(`filterModel.${modelKey}`)
      const _sortModel = await load(`sortModel.${modelKey}`)
      const _columnVisibilityModel = await load(
        `columnVisibilityModel.${modelKey}`,
      )
      const _paginationModel = await load(`paginationModel.${modelKey}`)
      if (_filterModel) {
        setFilterModel(_filterModel)
      }
      if (_sortModel) {
        setSortModel(_sortModel)
      }
      if (_columnVisibilityModel) {
        setColumnVisibilityModel(_columnVisibilityModel)
      } else {
        setColumnVisibilityModel(columnVisibility({ variant }))
      }
      if (_paginationModel) {
        setColumnVisibilityModel(_paginationModel)
      }
      setIsLoading(false)
    }
    fn()
  }, [modelKey, variant])

  const updateTable = useThrottle(() => {
    try {
      apiRef.current.applySorting()
      apiRef.current.unstable_applyFilters()
    } catch (e) {
      return
    }
  }, 500)

  useEffect(() => {
    const _disposer = onSnapshot(dataStore[variant], updateTable)
    return () => _disposer()
  }, [apiRef, dataStore, variant, updateTable])

  if (isLoading || dataStore.isLoading) {
    return <Startup />
  }

  return (
    <DataGrid
      apiRef={apiRef}
      rows={rows as Array<Device | Tag | Location>}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 50 },
        },
        filter: { filterModel: { items: [] } },
        sorting: { sortModel: [] },
        columns: { columnVisibilityModel: {} },
      }}
      slots={{
        row: DraggableRow,
        columnHeaders: MemoizedColumnHeaders,
        toolbar: GridToolbar,
      }}
      slotProps={{
        row: { type: variant },
        toolbar: {
          showQuickFilter: true,
        },
      }}
      density="compact"
      pageSizeOptions={[10, 50, 100]}
      onRowSelectionModelChange={onRowSelectionModelChange}
      onFilterModelChange={setFilterModel}
      onSortModelChange={setSortModel}
      onColumnVisibilityModelChange={setColumnVisibilityModel}
      onPaginationModelChange={setPaginationModel}
      filterModel={filterModel || { items: [] }}
      sortModel={sortModel || []}
      columnVisibilityModel={columnVisibilityModel || {}}
      disableRowSelectionOnClick={true}
      checkboxSelection
    />
  )
}

const TableWindow = ({
  path,
  node,
  variant = 'devices',
  filterVariant,
  filter,
  modelKey,
}: TableProps) => {
  const { dataStore } = useStores()

  const columns = useColumns({ variant, node })
  const [selectedRows, setSelectedRows] = useState([])

  const capabilities = useMemo<Set<string>>(() => {
    return new Set(
      selectedRows.reduce(
        (acc, { capabilities }) => [...acc, ...capabilities],
        [],
      ),
    )
  }, [selectedRows])
  const type = {
    devices: ItemType.device,
    tags: ItemType.tag,
    locations: ItemType.location,
  }[variant]

  const actions = useActions(
    {
      type,
      capabilities,
    },
    [capabilities],
  )

  const rows = useMemo((): Array<GridRowModel> => {
    let rows
    if (filter) {
      if (filterVariant === 'tag') {
        rows = values(dataStore.devices).filter(({ data }: any) =>
          data.tags.find(({ id }) => id === filter.id),
        )
      } else if (filterVariant === 'location') {
        if (variant === 'devices') {
          rows = values(dataStore.devices).filter(
            ({ data }: any) => data.location?.id === filter.id,
          )
        } else if (variant === 'tags') {
          rows = values(dataStore.tags).filter(
            ({ data: tag }: any) =>
              !!values(dataStore.devices)
                .filter(
                  ({ data: device }: any) => device.location?.id === filter.id,
                )
                .find(({ data: device }: any) =>
                  device.tags.find(deviceTag => deviceTag.id === tag.id),
                ),
          )
        }
      }
    } else {
      switch (variant) {
        case 'locations':
          rows = values(dataStore.locations)
          break
        case 'tags':
          rows = values(dataStore.tags)
          break
        case 'devices':
          rows = values(dataStore.devices)
          break
      }
    }
    return rows
  }, [variant, filterVariant, filter, dataStore])

  const additionalControls = useMemo(() => {
    if (selectedRows.length === 0 || capabilities.size === 0) {
      return null
    }
    return (
      <ButtonGroup sx={{ m: 1 }}>
        <Button disableRipple>{selectedRows.length}</Button>
        {Object.entries(actions).map(([key, { action }]) => (
          <Button
            key={key}
            onClick={() =>
              selectedRows.map(
                row => row.capabilities.includes(key) && action(row),
              )
            }
          >
            {actionLabel(key)}
          </Button>
        ))}
      </ButtonGroup>
    )
  }, [capabilities.size, actions, selectedRows])

  const windowTitle = useMemo(() => {
    let filterName = ''
    if (filterVariant !== null) {
      filterName = {
        tag: ` Tag ${filter.name}`,
        location: ` Location ${filter.name}`,
      }[filterVariant]
    }
    return {
      devices: `Devices${filterName}`,
      tags: `Tags${filterName}`,
      locations: `Locations${filterName}`,
    }[variant]
  }, [variant, filterVariant, filter?.name])

  return (
    <MosaicWindow
      title={windowTitle}
      path={path}
      additionalControls={additionalControls}
    >
      <Paper style={{ height: '100%' }}>
        <Table
          path={path}
          node={node}
          variant={variant}
          rows={rows}
          columns={columns}
          setSelectedRows={setSelectedRows}
          modelKey={modelKey}
        />
      </Paper>
    </MosaicWindow>
  )
}

TableWindow.defaultProps = {
  variant: 'devices',
  filterVariant: null,
  filter: null,
}

export default TableWindow
