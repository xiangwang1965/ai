import CRUD from "../CRUD";

class Report extends CRUD {
    constructor() {
        super();

        this.getAllCoursesUrl = "/ws/api/course/getAllCourses";
        this.getCoursesDetailsUrl = "/ws/api/course/getCoursesDetails";
    }

    getAllCourses(params) {
        return this.sendGet(this.getAllCoursesUrl, params);
    }

    getCoursesDetail(params) {
        return this.sendGet(this.getCoursesDetailsUrl, params);
    }
}

export default new Report();
