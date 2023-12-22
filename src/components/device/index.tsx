import React, { useMemo, useEffect } from 'react'
import { MosaicWindow } from 'react-mosaic-component'
import { Paper, ButtonGroup } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TreeItem from '@mui/lab/TreeItem'
import useActions, {
  actionLabel,
  iconMap,
  ItemType,
} from '../../hooks/useActions'
import DeviceInfo from './deviceInfo'
import { useStores } from '../../models'
import { Device } from '../../models/DataStore'
import { DeviceStatus } from '../../models/DataStore/DeviceStatus'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'

interface ObjectTreeItemProps {
  item: any
  nodeId: string
}

const ObjectTreeItem = observer<ObjectTreeItemProps>(({ item, nodeId }) => {
  if (!item || !Object.entries(item)) {
    return null
  }
  return (
    <>
      {Object.entries(item).map(([key, value]) => (
        <TreeItem
          key={`${nodeId}.${key}`}
          nodeId={`${nodeId}.${key}`}
          label={key}
        >
          {typeof value === 'object' ? (
            <ObjectTreeItem nodeId={`${nodeId}.${key}`} item={value} />
          ) : (
            <TreeItem
              nodeId={`${nodeId}.${key}.${value}`}
              label={String(value)}
            />
          )}
        </TreeItem>
      ))}
    </>
  )
})

const Actions = observer<{ id: number; status: DeviceStatus }>(
  ({ id, status }) => {
    const {
      capabilities,
      is_online,
      should_wake,
      should_shutdown,
      should_reboot,
      is_muted,
    } = status

    const actions = useActions(
      {
        type: ItemType.device,
        capabilities,
        is_online,
        is_muted,
        should_wake,
        should_reboot,
        should_shutdown,
      },
      [
        capabilities,
        is_online,
        is_muted,
        should_wake,
        should_reboot,
        should_shutdown,
      ],
    )

    if (capabilities.length === 0) {
      return null
    }

    return (
      <ButtonGroup sx={{ marginBottom: '1rem' }}>
        {Object.entries(actions).map(([key, { action, disabled, loading }]) => (
          <LoadingButton
            key={key}
            loading={loading}
            loadingPosition="end"
            onClick={() => action({ id })}
            disabled={disabled}
            endIcon={iconMap(key)}
            variant="outlined"
          >
            {actionLabel(key)}
          </LoadingButton>
        ))}
      </ButtonGroup>
    )
  },
)

const DeviceComponent = ({ path, target }) => {
  const { dataStore } = useStores()
  const device = useMemo<Device>(
    () => dataStore.getDevice(target),
    [target, dataStore],
  )
  const windowTitle = useMemo(() => {
    return `${device.name} (${device.data.primary_ip?.dns_name})`
  }, [device.name, device.data])

  useEffect(() => device.fetch(), [device])
  return (
    <MosaicWindow title={windowTitle} path={path}>
      <Paper sx={{ p: 2 }} style={{ height: '100%', overflowY: 'auto' }}>
        <Actions id={device.id} status={device.status} />
        <DeviceInfo id={device.id} />
        <div style={{ height: '1rem' }} />
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <TreeItem
            key={`${device.id}.root`}
            nodeId={`${device.id}.root`}
            label="All Device Properties"
          >
            <ObjectTreeItem item={device} nodeId={`${device.id}.eventsRoot`} />
          </TreeItem>
        </TreeView>
      </Paper>
    </MosaicWindow>
  )
}

export default DeviceComponent
