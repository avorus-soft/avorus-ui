import { createContext } from 'react'
import { AuthenticationType } from './authContext.types'

export default createContext<AuthenticationType>({
  isAuthenticated: false,
  loading: false,
  error: false,
})
