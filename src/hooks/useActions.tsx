import React, { useMemo } from 'react'
import { Box } from '@mui/material'
import {
  FlashOn,
  RestartAlt,
  PowerOff,
  VolumeUp,
  VolumeMute,
  Cancel,
  LocalFireDepartment,
  FireExtinguisher,
} from '@mui/icons-material'
import { api } from '../services/api/'
import { Status } from '../models/DataStore/Common'

export const iconMap = key => {
  switch (key) {
    case 'wake':
      return <FlashOn />
    case 'shutdown':
      return <PowerOff />
    case 'reboot':
      return <RestartAlt />
    case 'mute':
      return <VolumeMute />
    case 'unmute':
      return <VolumeUp />
    case 'scram':
      return <LocalFireDepartment />
    case 'unscram':
      return <FireExtinguisher />
    case 'cancel':
      return <Cancel />
    default:
      return <Box />
  }
}

export const actionLabel = key => {
  switch (key) {
    case 'wake':
      return 'Wake'
    case 'shutdown':
      return 'Shutdown'
    case 'reboot':
      return 'Reboot'
    case 'mute':
      return 'Mute'
    default:
      return key
  }
}

export enum ItemType {
  location = 'location',
  tag = 'tag',
  device = 'device',
}

const disabled = ({
  type,
  action,
  is_online,
  is_muted,
  should_wake,
  should_shutdown,
  should_reboot,
}) => {
  if (type === 'location' || type === 'tag') {
    return false
  }
  if (is_online === null) {
    return false
  }
  let disabled: boolean
  switch (action) {
    case 'wake':
      disabled = is_online === Status.online
      break
    case 'shutdown':
      disabled = is_online === Status.offline
      break
    case 'reboot':
      disabled = is_online === Status.offline
      break
    case 'mute':
      disabled = is_online === Status.offline || !!is_muted
      break
    case 'unmute':
      disabled = is_online === Status.offline || !is_muted
      break
    case 'cancel':
      disabled = !(should_wake || should_shutdown || should_reboot)
      break
    default:
      disabled = false
  }
  return disabled
}

const loading = ({
  action,
  isLoading,
  should_wake,
  should_shutdown,
  should_reboot,
}) => {
  let loading: boolean
  switch (action) {
    case 'wake':
      if (should_wake == null) {
        loading = false
      } else {
        loading = isLoading || should_wake
      }
      break
    case 'shutdown':
      if (should_shutdown == null) {
        loading = false
      } else {
        loading = isLoading || should_shutdown
      }
      break
    case 'reboot':
      if (should_reboot == null) {
        loading = false
      } else {
        loading = isLoading || should_reboot
      }
      break
    default:
      loading = isLoading
  }
  return loading
}

interface ActionsProps {
  type: ItemType
  capabilities: Set<string> | Array<string>
  is_online?: Status | null
  should_wake?: boolean | null
  should_shutdown?: boolean | null
  should_reboot?: boolean | null
  is_muted?: number | boolean | null
}

type ActionsReturnInterface = Record<
  string,
  { action: CallableFunction; disabled: boolean; loading: boolean }
>

const useActions = (
  {
    type,
    capabilities,
    is_online = null,
    should_wake = null,
    should_shutdown = null,
    should_reboot = null,
    is_muted = null,
  }: ActionsProps,
  dependencies: Array<any> = [],
) => {
  const isLoading = is_online === null ? false : is_online === Status.undefined

  const actions = useMemo<ActionsReturnInterface>(() => {
    const actions = [...capabilities].reduce(
      (acc, action) => ({
        ...acc,
        [action]: {
          action: item => api.action({ type, action, data: { data: item } }),
          disabled: disabled({
            type,
            action,
            is_online,
            is_muted,
            should_wake,
            should_shutdown,
            should_reboot,
          }),
          loading: loading({
            action,
            isLoading,
            should_wake,
            should_shutdown,
            should_reboot,
          }),
        },
      }),
      {},
    )
    if (type === 'location' || type === 'tag') {
      actions['scram'] = {
        action: item =>
          api.action({ type, action: 'scram', data: { data: item } }),
        disabled: false,
        loading: false,
      }
      actions['unscram'] = {
        action: item =>
          api.action({ type, action: 'unscram', data: { data: item } }),
        disabled: false,
        loading: false,
      }
    }
    actions['cancel'] = {
      action: item =>
        api.action({ type, action: 'cancel', data: { data: item } }),
      disabled: disabled({
        type,
        action: 'cancel',
        is_online,
        is_muted,
        should_wake,
        should_shutdown,
        should_reboot,
      }),
      loading: loading({
        action: 'cancel',
        isLoading,
        should_wake,
        should_shutdown,
        should_reboot,
      }),
    }
    return actions
  }, [...dependencies])

  return actions
}

export default useActions
