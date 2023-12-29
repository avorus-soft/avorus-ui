import { Save, Delete, Edit, Add, ExpandMore } from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Dialog,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Tooltip,
} from '@mui/material'
import update from 'immutability-helper'
import React, { useEffect, useMemo, useState } from 'react'

interface Option {
  label: string
  description: string
  slug: string
  type: string
  default: any
  value: any
}

interface DeviceOptionsConfig {
  label: string
  description: string
  slug: string
  value: Array<Option>
}

const DeviceOptions = ({
  config,
  onChange = config => null,
}: {
  config: DeviceOptionsConfig
  onChange: CallableFunction
}) => {
  const [state, setState] = useState({
    deviceOptions: config.value,
    isDirty: false,
  })

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      deviceOptions: config.value,
      isDirty: false,
    }))
  }, [config.value])

  useEffect(() => {
    if (state.isDirty) {
      onChange({
        ...config,
        value: state.deviceOptions,
      })
    }
  }, [state])

  return (
    <ListItem sx={{ width: '100%' }} disablePadding>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <ListItemText primary={config.label} secondary={config.description} />
        </AccordionSummary>
        <AccordionDetails>
          <List>
            {state.deviceOptions.map((device, deviceIdx) => (
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  disabled={!device.value.length}
                >
                  <ListItemText
                    primary={device.label}
                    secondary={device.description}
                  />
                </AccordionSummary>
                <AccordionDetails>
                  <List disablePadding>
                    {device.value.map((option, optionIdx) => (
                      <Tooltip title={option.description}>
                        <ListItem sx={{ paddingLeft: 0, paddingRight: 0 }}>
                          <TextField
                            variant="standard"
                            fullWidth
                            label={`${option.label} (Default: ${option.default})`}
                            type={option.type}
                            value={
                              state.deviceOptions[deviceIdx].value[optionIdx]
                                .value
                            }
                            onChange={event => {
                              setState({
                                ...state,
                                deviceOptions: update(state.deviceOptions, {
                                  [deviceIdx]: {
                                    value: {
                                      [optionIdx]: {
                                        value: {
                                          $set: event.target.value,
                                        },
                                      },
                                    },
                                  },
                                }),
                                isDirty: true,
                              })
                            }}
                          />
                        </ListItem>
                      </Tooltip>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>
    </ListItem>
  )
}

export default DeviceOptions
