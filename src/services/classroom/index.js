import CRUD from '../CRUD'

class Classroom extends CRUD {
  constructor () {
    super()
    this.dataUrl = 'http://47.93.223.75:3000/mock/12/ws/api/class/currentCls'
  }

  getData(){
    return this.sendGet(this.dataUrl,params).then(res => {
      this.handleError(res); 
    });
  }
}

export default new Classroom()
