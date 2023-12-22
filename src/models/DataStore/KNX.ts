import { Instance, SnapshotIn, types } from 'mobx-state-tree'
import { LocationModel } from './Location'
import { withSetPropAction } from '../helpers/withSetPropAction'
import { api } from '../../services/api'

export const KNXEventsModel = types
  .model({
    events: types.optional(
      types.array(
        types.model({
          id: types.identifier,
          target: types.reference(LocationModel),
          state: types.maybeNull(types.boolean),
          time: types.number,
          group_address: types.maybeNull(types.string),
        }),
      ),
      [],
    ),
    isLoading: types.optional(types.boolean, true),
  })
  .actions(withSetPropAction)
  .actions(store => ({
    async fetchEvents() {
      store.setProp('isLoading', true)
      store.setProp('events', await api.getKNXEvents())
      store.setProp('isLoading', false)
    },
  }))

export interface KNXEvents extends Instance<typeof KNXEventsModel> {}
export interface KNXEventsSnapshotIn
  extends SnapshotIn<typeof KNXEventsModel> {}
