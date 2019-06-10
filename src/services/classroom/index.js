import CRUD from '../CRUD'
class Classroom extends CRUD {
  constructor () {
    super()
    this.dataUrl = '/ws/api/class/currentCls'
    this.studentUtl = '/ws/api/class/clsStudents';
    this.deleteUrl = '/ws/api/class/delCls';
    this.courseOptionsUrl = '/ws/api/class/getCourseByShoolId';
    this.tearcherOptionsUrl = '/ws/api/user/getTeachers';
    this.addClassUrl = '/ws/api/class/addCls';
    this.searchStudentUrl = '/ws/api/user/getStudents';
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
  getCourseOptions(){
    return this.sendGet(this.courseOptionsUrl).then(res => {
      return res;
    })
  }
  getTeachersOptions(params){
    return this.sendGet(this.tearcherOptionsUrl,params).then(res => {
      return res
    })
  }
  createClass(params){
    return this.sendPost(this.addClassUrl,params).then(res => {
      return res;
    })
  }
  searchStuInfo(params) {
    return this.sendGet(this.searchStudentUrl,params).then(res => {
        return res;
      })
  }
}

export default new Classroom()
