import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAppSelector } from '@/store'

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user } = useAppSelector(s => s.auth)

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000')
    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  // Join appropriate room when user logs in
  useEffect(() => {
    if (socket && user) {
      if (user.role === 'admin') {
        socket.emit('join_admin_room', user.id)
        console.log(`Joined admin room for admin ${user.id}`)
      } else {
        socket.emit('join_user_room', user.id)
        console.log(`Joined user room for user ${user.id}`)
      }
    }
  }, [socket, user])

  return socket
}

