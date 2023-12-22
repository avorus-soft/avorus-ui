import React, { useMemo, useState, useCallback } from 'react'
import useAxios from 'axios-hooks'

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
} from '@mui/material'
import { Person, Badge, Password, Save, Check } from '@mui/icons-material'

import Config from '../config'
import PasswordInput from './passwordInput'

interface MeProps {
  me: {
    email: string
    is_superuser: boolean
  }
  open: boolean
  onClose: () => void
}

const PasswordModal = ({ me, open, onClose }: MeProps) => {
  const [{ data, loading, error }, patch] = useAxios(
    {
      url: `https://${Config.API_HOST}/users/me`,
      method: 'patch',
    },
    { manual: true },
  )
  const [password, setPassword] = useState<string>('')
  const [password2, setPassword2] = useState<string>('')

  const invalid = useMemo(() => {
    return password !== password2 || password.length < 4
  }, [password, password2])

  const save = useCallback(() => {
    patch({ data: { ...me, password } }).then(console.log)
  }, [me, password, patch])

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <List>
        <ListItem>
          <PasswordInput
            label="New Password"
            onChange={({ target }) => setPassword(target.value)}
            loading={loading}
            error={error}
          />
        </ListItem>
        <ListItem>
          <PasswordInput
            label="Repeat new Password"
            onChange={({ target }) => setPassword2(target.value)}
            loading={loading}
            error={error}
          />
        </ListItem>
        <ListItem>
          <ListItemButton disabled={invalid} onClick={save}>
            <ListItemIcon>{data ? <Check /> : <Save />}</ListItemIcon>
            <ListItemText>{data ? 'Saved' : 'Save'}</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  )
}

const MeModal = ({ me, open, onClose }: MeProps) => {
  const [pwModal, setPwModal] = useState(false)
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Box>
        <List>
          <ListItem>
            <ListItemButton disableRipple style={{ cursor: 'default' }}>
              <ListItemIcon>
                <Person />
              </ListItemIcon>
              <ListItemText>{me.email}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton disableRipple style={{ cursor: 'default' }}>
              <ListItemIcon>
                <Badge />
              </ListItemIcon>
              <ListItemText>{me.is_superuser ? 'Admin' : 'User'}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton onClick={() => setPwModal(true)}>
              <ListItemIcon>
                <Password />
              </ListItemIcon>
              <ListItemText>Change Password</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
      <PasswordModal me={me} open={pwModal} onClose={() => setPwModal(false)} />
    </Dialog>
  )
}

export default MeModal
