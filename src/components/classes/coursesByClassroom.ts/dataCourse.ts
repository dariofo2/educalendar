import { Course } from "../courses/course";

export class DataCourse {
    course: Course;
    date: string;

    constructor (course: Course,date: string) {
        this.course=course;
        this.date=date;
    }
}