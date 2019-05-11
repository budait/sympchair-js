module.exports = class Session{
  constructor(id){
    this.id = id
    this.ticking = false
    this.time = null
  }
}