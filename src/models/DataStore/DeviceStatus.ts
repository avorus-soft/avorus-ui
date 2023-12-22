import { Instance, types } from 'mobx-state-tree'
import { genericStatus } from './Common'

const error_enum = types.enumeration(['ok', 'warning', 'error'])

export const DeviceStatusModel = types.model({
  ...genericStatus,
  boot_time: types.maybeNull(types.number),
  uptime: types.maybeNull(types.number),
  fans: types.maybeNull(
    types.model({
      nct6795: types.maybeNull(
        types.array(
          types.model({
            label: types.string,
            current: types.number,
          }),
        ),
      ),
      dell_smm: types.maybeNull(
        types.array(
          types.model({
            label: types.string,
            current: types.number,
          }),
        ),
      ),
    }),
  ),
  lamps: types.maybeNull(
    types.array(types.array(types.union(types.number, types.boolean))),
  ),
  display: types.maybeNull(types.string),
  ires: types.maybeNull(types.string),
  powerfeeds: types.optional(types.array(types.boolean), []),
  errors: types.maybeNull(
    types.model({
      fan: types.maybeNull(error_enum),
      lamp: types.maybeNull(error_enum),
      temperature: types.maybeNull(error_enum),
      cover: types.maybeNull(error_enum),
      filter: types.maybeNull(error_enum),
      other: types.maybeNull(error_enum),
      playback: types.maybeNull(error_enum),
      easire: types.maybeNull(error_enum),
      display: types.maybeNull(error_enum),
    }),
  ),
  temperatures: types.maybe(
    types.model({
      coretemp: types.maybe(
        types.array(
          types.model({
            label: types.string,
            current: types.number,
            high: types.number,
          }),
        ),
      ),
    }),
  ),
  is_muted: types.maybeNull(types.union(types.number, types.boolean)),
})

export interface DeviceStatus extends Instance<typeof DeviceStatusModel> {}
