/* eslint-disable no-console */
const http = require('http')
const express = require('express')
const path = require('path')
const uuid = require('uuid')

const app = express()
const server = http.createServer(app)

const socketio = require('socket.io')

const Session = require('./session')

const io = socketio()
app.io = io

io.attach(server)

// note: this is real simple. use a db instead of this ;)
let sessions =[]

const newsession = (id) =>{
  sessions.push(new Session(id))
}

const publicSessions = () =>{
  return sessions.filter(i => i.display === true)
}



app.use('/client', express.static(path.join(__dirname, '/client')))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html')
})


app.get('/s/:id', (req,res)=>{
  let s = sessions.filter(i=>i.id === req.params.id)
  if(s.length !== 1){
    // no session exists with id, redirect to landing page
    res.redirect('/')
  } else{
    res.sendFile(__dirname + '/client/client.html')
  }
})

app.get('/admin/:id', (req,res)=>{
  let s = sessions.filter(i=>i.id === req.params.id)
  if(s.length !== 1){
    // no session exists with id, redirect to landing page
    res.redirect('/')
  } else{
    res.sendFile(__dirname + '/client/admin.html')
  }
})

io.on('connection', (socket) => {
  console.log('client connected')
  if(socket.handshake.query.room !== undefined){
    console.log(`client wants to join the session room: ${socket.handshake.query.room}`)
    socket.join(socket.handshake.query.room)
  }

  socket.on('disconnect', ()=>{
    console.log('client disconnected')
  })

  // messages from index and client
  socket.on('client',(ev)=>{
    switch(ev.cmd){
    case 'clienttime':{
      // send the current client time to admins
      socket.to(ev.id).emit('scmd', {cmd: 'clienttime', time: ev.time})
      // update time in sessions once in a while
      let sidx = sessions.findIndex(i=>i.id === ev.id)
      if(sidx > -1){
        sessions[sidx].time = ev.time
      }
    }
      break
    case 'clientstate':{
      // send the current client time to admins
      socket.to(ev.id).emit('scmd', {cmd: 'clientstate', ticking: ev.ticking})
      // update time in sessions once in a while
      let sidx = sessions.findIndex(i=>i.id === ev.id)
      if(sidx > -1){
        sessions[sidx].ticking = ev.ticking
      }
    }
      break
    case 'getsessions':
      //reply to the sender
      socket.emit('updatesessionlist', {sessions: publicSessions()})
      break
    case 'newsession':{
      let sid = ''
      if(ev.id !== undefined && ev.id.length > 0){
        sid = ev.id
      } else {
        sid = uuid()
      }
      newsession(sid)
      //console.log(sessions)
      socket.emit('sessioncreated', {id: sid})
      // this time emit for everyone (let other clients to update their session list)
      //io.emit('updatesessionlist', {sessions: sessions})
    }
      break
    case 'getsession':{
      let s = sessions.filter(i=>i.id === ev.id)
      if(s.length>0 && s.length === 1){
        socket.emit('scmd', {id: ev.id, cmd: 'sessiondata', err: null, data: s})
      } else{
        socket.emit('scmd',{id: ev.id, cmd: 'sessiondata', err: 'no session'})
      }
    }
      break
      
    default:
      console.log(`ERROR: invalid user command: ${ev.cmd}`)
    }
  })

  // messages from adminclient
  socket.on('adminclient',(ev)=>{
    console.log(`admin command for session: ${ev.id}, emitting it to room`)
    socket.to(ev.id).emit('scmd', ev)
  
    let sidx = sessions.findIndex(i=>i.id === ev.id)
    if(sidx > -1){
      switch(ev.cmd){
      case 'publishsession':
        sessions[sidx].public = true
        io.emit(io.emit('updatesessionlist', {sessions: publicSessions()}))
        break
      case 'start':
        sessions[sidx].ticking = true
        break
      case 'pause':
        sessions[sidx].ticking = false
        break
      case 'settime':
        sessions[sidx].time = ev.time
        break
      }
    }
    //console.log(sessions[sidx])
  })
})

server.listen(3000, function(){
  console.log('listening on *:3000')
})