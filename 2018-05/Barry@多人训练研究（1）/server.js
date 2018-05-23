let express = require('express')
let app = express()
let server = app.listen(2000, ()=>{
    console.log('listening at localhost 2000...')
})

app.use(express.static('public'))

let io = require('socket.io')(server)

io.sockets.on('connection', (socket) => {

  socket.on('pressmove', (data) => {
      socket.broadcast.emit('pressmove', data)
    }
  )
  
  socket.on('disconnect', () => {
    console.log("disconnected")
  })

})