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
    this.searchUrl = '/ws/api/user/getStudents';
    this.codeListUrl = '/ws/api/class/getCdksByClassId';
    this.createStudentUrl = '/ws/api/class/addStudent';
    this.virificodeUrl = '/ws/api/verificode';
    this.deleteStudentUrl = '/ws/api/class/delClsStudent';
  }

  getData(params){
    return this.sendGet(this.dataUrl,params).then(res => {
      return res;
    });
  }
  getStudent(params){
    return this.sendGet(this.searchUrl,params).then(res => {
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
  search(params){
    return this.sendGet(this.searchUrl,params).then(res => {
      return res;
    })
  }
  getCodeList(params){
    return this.sendGet(this.codeListUrl,params).then(res => {
      return res;
    })
  }
  createStudent(params){
    return this.sendPost(this.createStudentUrl,params).then(res => {
      return res;
    })
  }
  getVerificode(params){
    return this.sendPost(this.virificodeUrl,params).then(res => {
      return res;
    });
  }
  deleteStudent(params){
    return this.sendPost(this.deleteStudentUrl,params).then(res => {
      return res;
    })
  }
}

export default new Classroom()
