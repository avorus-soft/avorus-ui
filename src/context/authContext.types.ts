export interface AuthenticationType {
  isAuthenticated: boolean
  loading: boolean
  error: boolean
  token?: string
  login?: () => void
  logout?: () => void
}
