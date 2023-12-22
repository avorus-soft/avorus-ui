import { Instance, SnapshotOut, types } from 'mobx-state-tree'
import { withSetPropAction } from './helpers/withSetPropAction'

export const SettingsModel = types
  .model('Settings')
  .props({
    showErrors: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)

export interface Settings extends Instance<typeof SettingsModel> {}
export interface SettingsSnapshotOut
  extends SnapshotOut<typeof SettingsModel> {}
