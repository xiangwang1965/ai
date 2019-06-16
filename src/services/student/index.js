import CRUD from "../CRUD";

class Student extends CRUD {
    constructor() {
        super();

        this.getUserInfoUrl = "/ws/api/class/getUserInfo";
    }

    getUserInfo(params) {
        return this.sendGet(this.getUserInfoUrl, params);
    }
}

export default new Student();
