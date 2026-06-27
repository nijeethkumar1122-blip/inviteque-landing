import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginSuccess() {
  const [searchParams] = useSearchParams()
  const { loginWithData } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const name = searchParams.get('name')
    const email = searchParams.get('email')

    if (token) {
      // Use the loginWithData function from context to save data
      loginWithData({ token, userId, name, email })
      
      // Short delay to ensure storage is committed
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    } else {
      window.location.href = '/login'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null // No UI needed as the redirect is instant
}
