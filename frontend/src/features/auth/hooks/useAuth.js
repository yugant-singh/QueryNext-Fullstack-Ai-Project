import { useDispatch } from 'react-redux'
import { setError, setUser, setLoading, clearUser } from '../auth.slice'
import { register, login, getMe, logout } from '../services/auth.api'

export function useAuth() {
  const dispatch = useDispatch()

  async function handleRegister({ username, email, password }) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await register({ username, email, password })
      return true // ← success
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Registration Failed"))
      return false // ← failure
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(setLoading(true))
      dispatch(setError(null))
      const data = await login({ email, password })
      dispatch(setUser(data.user))
      return true
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "Login Failed"))
      return false
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true))
      const data = await getMe()
      dispatch(setUser(data.user))
    } catch (err) {
      if (err.response?.status === 401) {
        dispatch(clearUser())
      } else {
        dispatch(setError(err.response?.data?.message || "Could not fetch user details"))
      }
    } finally {
      dispatch(setLoading(false))
    }
  }

  async function handleLogOut() {
    try {
      dispatch(setLoading(true))
      await logout()
      dispatch(clearUser())
      window.location.href = '/login'
    } catch (err) {
      dispatch(setError(err.response?.data?.message || "LogOut Failed"))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return { handleRegister, handleLogin, handleGetMe, handleLogOut }
}