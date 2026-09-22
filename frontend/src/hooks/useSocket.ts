

  // Join appropriate room when user logs in
  useEffect(() => {
    if (socket && user) {
      if (user.role === 'seller') {
        socket.emit('join_admin_room', user.id)
        console.log(`Joined seller room for seller ${user.id}`)
      } else {
        socket.emit('join_user_room', user.id)
        console.log(`Joined user room for user ${user.id}`)
      }
    }
  }, [socket, user])

  return socket
}

