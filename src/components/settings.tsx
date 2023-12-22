import React, { useEffect, useState } from 'react'
import { Dialog, FormControlLabel, List, ListItem, Switch } from '@mui/material'
import { useStores } from '../models'
import { SettingsSnapshotOut } from '../models/SettingsStore'

const Settings = ({ open, onClose }) => {
  const { settingsStore } = useStores()
  const [state, setState] = useState<SettingsSnapshotOut>({
    ...settingsStore,
  })

  useEffect(() => {
    settingsStore.setProp('showErrors', state.showErrors)
  }, [settingsStore, state])

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <List>
        <ListItem>Settings</ListItem>
        <ListItem>
          <FormControlLabel
            label="Show error notifications"
            control={
              <Switch
                checked={state.showErrors}
                onChange={({ target }) =>
                  setState({ showErrors: target.checked })
                }
              />
            }
          />
        </ListItem>
      </List>
    </Dialog>
  )
}

export default Settings
