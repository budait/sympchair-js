/*global io:true $:true formatTime*/

// get the session id
let id = window.location.pathname.split('/').pop()

const socket = io(window.location.host, {
  query: {
    room: id,
  }
})

let timediv = $('#time')

const scaleTimer =()=>{
  let fs = Math.floor($(window).width()/3)
  let w = $(window).width()
  let h = $(window).height()
  
  timediv.css('font-size', fs)
  timediv.css('margin-left', w/2 - timediv.width()/2)
  timediv.css('margin-top', h/2 - timediv.height()/2 - fs/10)
}

$(window).resize(scaleTimer)


const setTime = (t) => {
  if(t !== undefined){
    timediv.text(formatTime(time))
  } else {
    timediv.text('--:--')
  }
}

const init = ()=>{
  setTime()
  scaleTimer()
}

$(document).ready(init)


let flashsteps = 0
let flashIntO = null

const flash = ()=>{
  flashIntO = setInterval(()=>{
    if(flashsteps%2 === 0){
      $('body').css('background', '#FF0000')
    } else {
      $('body').css('background', '#000')
    }
    if(flashsteps>4){
      flashsteps=0
      clearInterval(flashIntO)
    } else {
      flashsteps++
    }
  },500)
}


let time = 0
let tickO = null

let ticker = ()=>{
  if(time>0){
    time-=1
    setTime(time)
    if(time === 120){
      flash()
    }

    socket.emit('client', {id: id, cmd: 'clienttime', time: time})
  } else{
    pause()
  }
}

let start = ()=>{
  if(tickO === null){
    tickO = setInterval(ticker, 1000)
    socket.emit('client', {id: id, cmd: 'clientstate', ticking: true})
  }
}

let pause = () => {
  clearInterval(tickO)
  tickO = null
  socket.emit('client', {id: id, cmd: 'clientstate', ticking: false})
}

socket.on('connect', () => {
  socket.emit('client', {id: id, cmd: 'getsession', time: time})
})


socket.on('disconnect', (reason) => {
  console.log('socket disconnected')
  if (reason === 'io server disconnect') {
    // the disconnection was initiated by the server, you need to reconnect manually
    socket.connect()
  }
  // else the socket will automatically try to reconnect
})

socket.on('scmd', (ev)=>{
  //console.log('got event on session socket',ev)
  // this check should always return true
  if(ev.id === id){
    switch(ev.cmd){
    case 'sessiondata':
      if(ev.err === null){
        let s = ev.data[0]
        //console.log(s)
        if(s.time !== null){
          time = s.time
          setTime(time)
        }
        if(s.ticking){
          start()
        }
      }
      break
    case 'settime':
      time = ev.time
      setTime(time)
      socket.emit('client', {id: id, cmd: 'clienttime', time: time})
      break
    case 'start':
      start()
      break
    case 'pause':
      pause()
      break
    }  
  }
})