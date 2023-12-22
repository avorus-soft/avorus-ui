import { createContext } from 'react'
import { AppContextType } from './appContext.types'

export default createContext<AppContextType>({
  devices: [],
  tags: [],
  locations: [],
})
