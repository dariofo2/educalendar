import { DataCourse } from "./dataCourse";

export default class CoursesByClassroom {
    classroom: number;
    dataMorning: DataCourse[]=[];
    dataAfternoon: DataCourse[]=[];

    constructor (classroom: number) {
        this.classroom=classroom;
    }
}