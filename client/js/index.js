/* eslint-disable no-unused-vars */
/*global io:true $:true*/

const socket = io()

const newsession = ()=>{
  let sid = $('#sid').val()
  console.log(sid)
  socket.emit('client', {cmd:'newsession', id: sid})
}

console.log('SympChair-JS loaded')
socket.emit('client', {cmd: 'getsessions'})

socket.on('sessioncreated',(ev)=>{
  window.location.href = `/admin/${ev.id}`
})


socket.on('updatesessionlist',(ev)=>{
  if(ev.sessions){
    $('#sessionlist').empty()
    for(let i=0;i<ev.sessions.length;i++){
      let s = ev.sessions[i]
      $('#sessionlist').append(`<tr><td>${i+1}.</td><td><a href="/s/${s.id}">${s.id}</a></td><td><a class="button" href="/admin/${s.id}">admin</a></td></tr>`)
    }
  }
})


