/* eslint-disable no-unused-vars */
/*global io:true $:true formatTime*/

// get the session id
let id = window.location.pathname.split('/').pop()

const socket = io(window.location.host, {
  query: {
    room: id
  }
})

$('#sid').text(id)

let ctimediv = $('#ctime')

const settime = () =>{
  let m = $('#minutes').val()
  let s = $('#seconds').val()
  let time = Number(m)*60+Number(s)
  console.log(`settime ${m}:${s} which is ${time} in seconds`)
  socket.emit('adminclient' ,{id: id, cmd: 'settime', time: time})
}

const start = () =>{
  socket.emit('adminclient' ,{id: id, cmd: 'start'})
}

const pause = () =>{
  socket.emit('adminclient' ,{id: id, cmd: 'pause'})
}

socket.on('scmd',(ev)=>{
  switch(ev.cmd){
  case 'clienttime':
    ctimediv.text(formatTime(ev.time))
    break
  }
})