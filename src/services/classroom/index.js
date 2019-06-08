import CRUD from '../CRUD'
class Classroom extends CRUD {
  constructor () {
    super()
    this.dataUrl = '/ws/api/class/currentCls'
    this.studentUtl = '/ws/api/class/clsStudents';
    this.deleteUrl = '/ws/api/class/delCls';
  }

  getData(params){
    return this.sendGet(this.dataUrl,params).then(res => {
      return res;
    });
  }
  getStudent(params){
    return this.sendGet(this.studentUtl,params).then(res => {
      return res;
    })
  }
  deleteClass(params){
    return this.sendPost(this.deleteUrl,params).then(res => {
      return res;
    })
  }
}

export default new Classroom()
