import {
  Save,
  Delete,
  Edit,
  Add,
  Backup,
  History,
  ExpandMore,
} from '@mui/icons-material'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Dialog,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import useAxios from 'axios-hooks'
import React, { useEffect, useMemo, useState } from 'react'
import Config from '../../config'

const Rule = ({ index, rule, onSave, onDelete }) => {
  const [state, setState] = useState({
    fieldName: null,
    value: null,
    isDirty: false,
  })

  const isValid = useMemo(() => !!state.fieldName && !!state.value, [state])

  useEffect(() => {
    try {
      const [[fieldName, value]] = Object.entries(rule)
      setState({ fieldName, value, isDirty: false })
    } catch {}
  }, [rule])

  return (
    <ListItem>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'row',
          gap: '10px',
        }}
      >
        <TextField
          label="Field Name"
          value={state.fieldName}
          onChange={event =>
            setState({ ...state, fieldName: event.target.value, isDirty: true })
          }
          color={isValid ? 'primary' : 'error'}
          sx={{ flexGrow: 1 }}
        />
        <TextField
          label="Value"
          value={state.value}
          onChange={event =>
            setState({ ...state, value: event.target.value, isDirty: true })
          }
          color={isValid ? 'primary' : 'error'}
          sx={{ flexGrow: 1 }}
        />
      </Box>
      <ListItemIcon>
        <IconButton onClick={() => onDelete(index)}>
          <Delete />
        </IconButton>
        <IconButton
          disabled={!state.isDirty || !isValid}
          color={isValid ? 'success' : 'error'}
          onClick={() => {
            onSave(index, { [state.fieldName]: state.value })
            setState({ ...state, isDirty: false })
          }}
        >
          <Save />
        </IconButton>
      </ListItemIcon>
    </ListItem>
  )
}

const DeviceRules = ({
  className,
  rules = [],
  onSave = rules => null,
  ...rest
}) => {
  const [state, setState] = useState(rules)

  useEffect(() => {
    setState(rules)
  }, [rules])

  return (
    <Dialog open={rest.open} onClose={rest.onClose} fullWidth>
      <DialogTitle>{className}</DialogTitle>
      <DialogContentText></DialogContentText>
      <List>
        {!state.length && (
          <ListItem>
            <ListItemText primary="No rules yet" />
          </ListItem>
        )}
        {state.map((rule, i) => (
          <Rule
            key={JSON.stringify(rule) + i.toString()}
            index={i}
            rule={rule}
            onSave={(index, rule) => {
              setState(prevRules => {
                prevRules.splice(index, 1, rule)
                return [...prevRules]
              })
              onSave(state)
            }}
            onDelete={index => {
              setState(prevRules => {
                prevRules.splice(index, 1)
                return [...prevRules]
              })
              onSave(state)
            }}
          />
        ))}
        <ListItem disableGutters>
          <ListItemButton onClick={() => setState([...state, {}])}>
            <ListItemText secondary={'add rule'} />
            <ListItemIcon>
              <Add />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  )
}

const DeviceMap = () => {
  const [{ data: deviceOrder = {} }, refetch] = useAxios(
    {
      url: `https://${Config.API_HOST}/config/devicemap`,
    },
    { useCache: false },
  )
  const [, post] = useAxios(
    {
      url: `https://${Config.API_HOST}/config/devicemap`,
      method: 'POST',
    },
    { useCache: false, manual: true },
  )

  const [state, setState] = useState({
    deviceOrder,
    isDirty: false,
  })

  useEffect(() => {
    setState(prevState => ({ ...prevState, deviceOrder, isDirty: false }))
  }, [deviceOrder])

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography sx={{ width: '33%', flexShrink: 0 }}>
          Wake/Shutdown order
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List
          subheader={
            <>
              <Tooltip title="Discard changes">
                <IconButton
                  disabled={!state.isDirty}
                  onClick={() => setState({ deviceOrder, isDirty: false })}
                >
                  <History />
                </IconButton>
              </Tooltip>
              <Tooltip title="Save device order">
                <IconButton
                  disabled={!state.isDirty}
                  onClick={() => {
                    post({ data: state.deviceOrder }).then(refetch)
                  }}
                >
                  <Backup />
                </IconButton>
              </Tooltip>
            </>
          }
        ></List>
      </AccordionDetails>
    </Accordion>
  )
}

export default DeviceMap
