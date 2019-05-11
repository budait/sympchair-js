/* eslint-disable no-unused-vars */
const formatTime = (time) => {
  let t = parseInt(time, 10)
  let h   = Math.floor(t / 3600)
  let m = Math.floor((t - (h * 3600)) / 60)
  let s = t - (h * 3600) - (m * 60)

  if (h < 10) {h = '0'+h}
  if (m < 10) {m ='0'+m}
  if (s < 10) {s = '0'+s}
  
  if(h < 1){
    return `${m}:${s}`
  } else {
    return `${h}:${m}:${s}`
  }
}