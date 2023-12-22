import { types } from 'mobx-state-tree'

export enum Status {
  undefined = -1,
  offline = 0,
  intermediate = 1,
  online = 2,
}

export enum EventLabel {
  is_online = 'is_online',
  should_wake = 'should_wake',
  should_reboot = 'should_reboot',
  should_shutdown = 'should_shutdown',
}

export interface EventType {
  target: number
  capabilities?: Array<string>
  type?: EventLabel
  is_online?: Status
  should_wake?: boolean
  should_reboot?: boolean
  should_shutdown?: boolean
  errors?: object
  temperatures?: object
  fans?: object
  boot_time?: number
  lamps?: Array<Array<any>>
  ires?: string
  powerfeeds?: Array<boolean>
}

export const genericStatus = {
  is_attached: types.optional(types.boolean, false),
  is_online: types.optional(
    types.union(
      types.literal(Status.undefined),
      types.literal(Status.offline),
      types.literal(Status.intermediate),
      types.literal(Status.online),
    ),
    Status.undefined,
  ),
  should_wake: types.optional(types.boolean, false),
  should_shutdown: types.optional(types.boolean, false),
  should_reboot: types.optional(types.boolean, false),
  capabilities: types.optional(types.array(types.string), []),
}
