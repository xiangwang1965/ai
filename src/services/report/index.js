import CRUD from "../CRUD";

class Report extends CRUD {
    constructor() {
        super();

        this.getAllCoursesUrl = "/ws/api/course/getAllCourses";
        this.getCoursesDetailsUrl = "/ws/api/course/getCoursesDetails2";
        this.getProcessAndLevelUrl = "/ws/api/course/getProcessAndLevel";
    }

    getAllCourses(params) {
        return this.sendGet(this.getAllCoursesUrl, params);
    }

    getCoursesDetail(params) {
        return this.sendGet(this.getCoursesDetailsUrl, params);
    }

    getProcessAndLevel(params) {
        return this.sendGet(this.getProcessAndLevelUrl, params);
    }
}

export default new Report();
