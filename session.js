module.exports = class Session{
  constructor(id){
    this.id = id
    this.public = false
    this.ticking = false
    this.time = null
  }
}