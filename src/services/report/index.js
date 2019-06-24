import CRUD from '../CRUD'
class Report extends CRUD {
  constructor () {
    super()
    this.addStuForClassUrl = '/ws/api/class/addStudentForClass';
  }


  addhaveStu(params){
    return this.sendPost(this.addStuForClassUrl,params).then(res => {
        return res;
    })
  }

}

export default new Report()
