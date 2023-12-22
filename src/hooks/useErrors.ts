import { useEffect } from 'react'
import { useStores } from '../models'
import { onSnapshot } from 'mobx-state-tree'
import { ErrorSnapshot } from '../models/ErrorStore'
import { useSnackbar } from 'notistack'

const useErrors = () => {
  const { errorStore, authenticationStore, settingsStore } = useStores()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const _unsubscribe = onSnapshot(
      errorStore,
      (snapshot: Array<ErrorSnapshot>) => {
        const error = snapshot.slice(-1)[0]
        if (settingsStore.showErrors) {
          enqueueSnackbar(`${error.message}: ${error.errors}`, {
            variant: 'error',
          })
        }
        if (error.message === 'Authentication failed') {
          authenticationStore.logout()
        }
      },
    )
    return () => _unsubscribe()
  }, [errorStore, authenticationStore, settingsStore, enqueueSnackbar])
}

export default useErrors
