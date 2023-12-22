/**
 * This file is where we do "rehydration" of your RootStore from AsyncStorage.
 * This lets you persist your state between app launches.
 *
 * Note that Fast Refresh doesn't play well with this file, so if you edit this,
 * do a full refresh of your app instead.
 *
 * @refresh reset
 */
import { applySnapshot, IDisposer, onSnapshot } from 'mobx-state-tree'
import { RootStore, RootStoreSnapshot } from '../RootStore'
import * as storage from '../../utils/storage'

/**
 * The key we'll be saving our state as within async storage.
 */
const ROOT_STATE_STORAGE_KEY = 'root-v1'
const AUTH_STATE_STORAGE_KEY = `${ROOT_STATE_STORAGE_KEY}_auth`
const SETTINGS_STATE_STORAGE_KEY = `${ROOT_STATE_STORAGE_KEY}_settings`

/**
 * Setup the root state.
 */
let _disposers: Array<IDisposer> = []
export async function setupRootStore(rootStore: RootStore) {
  let restoredState: RootStoreSnapshot | undefined | null

  try {
    // load the last known state from AsyncStorage
    restoredState = ((await storage.load(AUTH_STATE_STORAGE_KEY)) ??
      {}) as RootStoreSnapshot
    applySnapshot(rootStore, restoredState)
  } catch (e) {
    // if there's any problems loading, then inform the dev what happened
    console.error(e.message, null)
  }

  try {
    // load the last known state from AsyncStorage
    restoredState = ((await storage.load(SETTINGS_STATE_STORAGE_KEY)) ??
      {}) as RootStoreSnapshot
    applySnapshot(rootStore, restoredState)
  } catch (e) {
    // if there's any problems loading, then inform the dev what happened
    console.error(e.message, null)
  }

  // stop tracking state changes if we've already setup
  _disposers.forEach(_disposer => _disposer())

  // track changes & save to AsyncStorage
  _disposers.push(
    onSnapshot(rootStore.authenticationStore, snapshot =>
      storage.save(AUTH_STATE_STORAGE_KEY, { authenticationStore: snapshot }),
    ),
  )
  _disposers.push(
    onSnapshot(rootStore.settingsStore, snapshot =>
      storage.save(SETTINGS_STATE_STORAGE_KEY, { settingsStore: snapshot }),
    ),
  )

  const unsubscribe = () => {
    _disposers.forEach(_disposer => _disposer())
    _disposers = []
  }

  return { rootStore, restoredState, unsubscribe }
}
