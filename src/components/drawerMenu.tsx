import React, { useMemo, useState, useEffect } from 'react'
import useAxios from 'axios-hooks'

import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from '@mui/material'
import { Person, Group, Settings } from '@mui/icons-material'

import Config from '../config'
import MeModal from './meModal'
import UsersModal from './usersModal'
import SettingsModal from './settings'

const DrawerMenu = ({ toolbarButtons, onClose }) => {
  const [{ data: me = {} }] = useAxios({
    url: `https://${Config.API_HOST}/users/me`,
  })
  const [meIsOpen, setMeIsOpen] = useState<boolean>(false)
  const [usersIsOpen, setUsersIsOpen] = useState<boolean>(false)
  const [settingsIsOpen, setSettingsIsOpen] = useState<boolean>(false)

  return (
    <Box
      role="presentation"
      sx={{ width: 250, minHeight: '100%', display: 'grid' }}
    >
      <List>
        <Box>
          <ListItem>
            <img src="/logo.svg" alt="Logo" />
          </ListItem>
          {toolbarButtons.map(({ disabled, key, label, onClick }) => (
            <ListItem key={key}>
              <ListItemButton
                onClick={() => {
                  onClick()
                  onClose()
                }}
                disabled={disabled}
              >
                <ListItemText>{label}</ListItemText>
              </ListItemButton>
            </ListItem>
          ))}
          <Divider />
        </Box>
        <ListItem>
          <ListItemButton onClick={() => setMeIsOpen(true)}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText>Account</ListItemText>
          </ListItemButton>
        </ListItem>
        {me.is_superuser ? (
          <ListItem>
            <ListItemButton onClick={() => setUsersIsOpen(true)}>
              <ListItemIcon>
                <Group />
              </ListItemIcon>
              <ListItemText>Users</ListItemText>
            </ListItemButton>
          </ListItem>
        ) : null}
        <ListItem>
          <ListItemButton onClick={() => setSettingsIsOpen(true)}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ justifySelf: 'end', alignSelf: 'end', margin: '10px' }}>
        <Typography variant="caption">v{Config.version}</Typography>
      </Box>
      <MeModal me={me} open={meIsOpen} onClose={() => setMeIsOpen(false)} />
      <UsersModal open={usersIsOpen} onClose={() => setUsersIsOpen(false)} />
      <SettingsModal
        open={settingsIsOpen}
        onClose={() => setSettingsIsOpen(false)}
      />
    </Box>
  )
}

export default DrawerMenu
