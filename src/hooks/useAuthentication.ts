import { useRef, useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import useAxios from 'axios-hooks'

import Config from '../config'
import { useStores } from '../models'
import { AuthenticationType } from '../context/types'
import { save, load, remove } from '../utils/storage'

const axiosIntercept = ({
  token,
  logout,
}: {
  token: string
  logout: () => void
}) =>
  axios.interceptors.request.use(
    async config => {
      if (token) {
        config.headers = {
          authorization: `Bearer ${token}`,
        }
      }
      return config
    },
    error => {
      logout()
      return Promise.reject(error)
    },
  )

const useAuthentication = (): [
  AuthenticationType,
  {
    login: ({
      username,
      password,
    }: {
      username: string
      password: string
    }) => void
    logout: () => void
  },
] => {
  const { authenticationStore } = useStores()
  const [{ loading, error: loginError }, postLogin] = useAxios(
    {
      url: `https://${Config.API_HOST}/auth/jwt/login`,
      method: 'post',
    },
    { manual: true },
  )
  const [, postLogout] = useAxios(
    {
      url: `https://${Config.API_HOST}/auth/jwt/logout`,
      method: 'post',
    },
    { manual: true },
  )
  const [token, setToken] = useState()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState(false)

  const logout = useCallback(async () => {
    try {
      await postLogout()
    } catch (exception) {
      console.error(exception)
    } finally {
      await remove('auth')
      setToken(undefined)
      authenticationStore.logout()
    }
  }, [authenticationStore, postLogout])

  useEffect(() => {
    axiosIntercept({ token, logout })
    authenticationStore.setAuthToken(token)
    setIsAuthenticated(!!token)
  }, [authenticationStore, token, logout])

  const login = useCallback(
    ({ username, password }) => {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      postLogin({ data: formData }).then(({ data }) =>
        save('auth', data).then(() => {
          authenticationStore.setAuthToken(data.access_token)
          setToken(data.access_token)
        }),
      )
    },
    [postLogin, authenticationStore],
  )

  const refreshInterval = useRef<string | number>()

  useEffect(() => {
    if (isAuthenticated) {
      refreshInterval.current = window.setInterval(async () => {
        const { data } = await axios.post(
          `https://${Config.API_HOST}/auth/jwt/refresh`,
        )
        await save('auth', data)
        authenticationStore.setAuthToken(data.access_token)
        setToken(data.access_token)
      }, 3600000)
    }
    return () => window.clearInterval(refreshInterval.current)
  }, [authenticationStore, isAuthenticated])

  useEffect(() => {
    load('auth').then(auth => {
      if (auth) {
        axios
          .post(`https://${Config.API_HOST}/auth/jwt/refresh`, null, {
            headers: {
              authorization: `Bearer ${auth.access_token}`,
            },
          })
          .then(async ({ data }) => {
            await save('auth', data)
            setToken(data.access_token)
          })
          .catch(() => remove('auth'))
      }
    })
  }, [])

  useEffect(() => {
    setError(!!loginError)
  }, [loginError])

  return [
    { token, isAuthenticated, error, loading },
    { login, logout },
  ]
}

export default useAuthentication
