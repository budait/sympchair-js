/* eslint-disable no-unused-vars */
/*global io:true $:true*/

const socket = io()

const newsession = ()=>{
  socket.emit('client', {cmd:'newsession'})
}

console.log('SympChair-JS loaded')
socket.emit('client', {cmd: 'getsessions'})


socket.on('updatesessionlist',(ev)=>{
  if(ev.sessions){
    $('#sessionlist').empty()
    for(let i=0;i<ev.sessions.length;i++){
      let s = ev.sessions[i]
      $('#sessionlist').append(`<tr><td>${i+1}.</td><td><a href="/s/${s.id}">${s.id}</a></td><td><a class="button" href="/admin/${s.id}">admin</a></td></tr>`)
    }
  }
})


