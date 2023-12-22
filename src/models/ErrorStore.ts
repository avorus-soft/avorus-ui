import { SnapshotOut, types } from 'mobx-state-tree'

export const ErrorModel = types.model({
  id: types.identifier,
  message: types.string,
  errors: types.optional(
    types.array(types.union(types.string, types.number)),
    [],
  ),
  time: types.number,
})

export interface ErrorSnapshot extends SnapshotOut<typeof ErrorModel> {}
