"use client"
import { Course } from "@/components/classes/courses/course";
import CoursesByClassroom from "@/components/classes/coursesByClassroom.ts/CoursesByClassroom";
import { DataCourse } from "@/components/classes/coursesByClassroom.ts/dataCourse";
import moment, { Moment } from "moment";
import { ChangeEvent, useState } from "react";

export default function ViewCourses() {
    const [courses, setCourses] = useState([] as Course[]);
    const [possibleClassRoms, setPossibleClassrooms] = useState(0);
    const festives = new Set<string>(["2025-10-20", "2025-08-25"]);
    const [firstDayStart, setFirstDayStart] = useState("2025-9-15");

    let coursesByClassrooms: CoursesByClassroom[] = [];

    function addNewCourse() {
        setCourses([...courses, new Course("", 0, [])]);
        console.log(courses);
    }

    function deleteCourse(id: number) {
        const coursesWithoutDeleted = courses.filter((x, index) => {
            if (index != id) return x;
        })
        setCourses([...coursesWithoutDeleted]);
    }

    function updateCourse(e: ChangeEvent, id: number) {
        const inputElem = e.target as HTMLInputElement;
        let coursesCopy = [...courses];

        const courseFound = coursesCopy.find((x, index) => {
            if (index == id) return x;
        })

        if (courseFound) {
            if (inputElem.name == "possibleClassrooms") {
                if (inputElem.checked) {
                    //console.log(inputElem.value);
                    courseFound.possibleClassrooms.push(parseInt(inputElem.value));
                    //console.log(courseFound);
                } else {
                    courseFound.possibleClassrooms = courseFound.possibleClassrooms.filter(x => {
                        if (x != parseInt(inputElem.value)) return x;
                    })
                    //console.log(courseFound)
                }

            } else {
                (courseFound as any)[inputElem.name] = inputElem.value;
            }
        }


        setCourses([...coursesCopy]);
    }

    function onChangePossibleClassrooms(e: ChangeEvent) {
        const inputElem = e.target as HTMLInputElement;
        setPossibleClassrooms(parseInt(inputElem.value));
    }

    //2 times in a same classroom, Morning and Afternoon
    //First check first courses with less possibleClassRooms
    //1 Morning 1 Afternoon
    function goMakeCalendar() {
        //Create CoursesByClassrooms 
        coursesByClassrooms=[];
        for (let i = 0; i < possibleClassRoms; i++) {
            coursesByClassrooms.push(new CoursesByClassroom(i + 1));
        }


        //Get Courses first by 1 Classroom, 2nd 2 Classrooms and keep going
        for (let i = 0; i < possibleClassRoms; i++) {
            const coursesFiltered = courses.filter(x => x.possibleClassrooms.length == i + 1)

            let isMorning = false;
            if (coursesFiltered.length > 0) {

                //For each Course, assign days
                coursesFiltered.forEach(x => {
                    //Set for each course 1 time morning 1 time afternoon
                    if (isMorning) isMorning = false;
                    else isMorning = true;

                    //Check Class and if is Morning or Afternoon
                    let dataMorningOrAfternoonMax: number | undefined = undefined;
                    //Check Class and if is Morning or Afternoon
                    const classroomNumberToUse = coursesByClassrooms.reduce((numberReduced: number, h) => {
                        let dataMaxInThisClassroom = dataMorningOrAfternoonMax;
                        if (x.possibleClassrooms.find(o => h.classroom == o)) {
                            if (!dataMorningOrAfternoonMax) {
                                dataMorningOrAfternoonMax = h.dataMorning.length;
                                isMorning = true;
                            }
                            if (h.dataMorning.length < dataMorningOrAfternoonMax) {
                                dataMorningOrAfternoonMax = h.dataMorning.length;
                                isMorning = true;
                            }
                            if (h.dataAfternoon.length < dataMorningOrAfternoonMax) {
                                dataMorningOrAfternoonMax = h.dataAfternoon.length;
                                isMorning = false;
                            }
                            return h.classroom;
                        } else {
                            return numberReduced;
                        }
                    }, 0);

                const daysLengthThisCourse = x.daysLength;
                //let daysCount=0; No lo vamos a necesitar

                //If is morning
                if (isMorning) {
                    /*
                    //Let Classroom with less Days used
                    let dataMorningMax: number | undefined = undefined;
                    //Let Classroom with less Days used
                    const classroomNumberToUse = coursesByClassrooms.reduce((numberReduced: number, h) => {
                        if (x.possibleClassrooms.find(o => h.classroom == o)) {
                            if (!dataMorningMax) {
                                dataMorningMax = h.dataMorning.length;
                                return h.classroom
                            } else {
                                if (h.dataMorning.length < dataMorningMax) {
                                    dataMorningMax = h.dataMorning.length;
                                    return h.classroom;
                                }

                                return numberReduced;
                            }
                        } else {
                            return numberReduced;
                        }
                    }, 0)
                    */
                    console.log(classroomNumberToUse);
                    //Assign ActualCourseThisClassRoom
                    let actualCoursesthisClassroom = coursesByClassrooms.find(y => y.classroom == classroomNumberToUse) as CoursesByClassroom;

                    //Set First Day To Start in Moment Date
                    let actualDate: Moment
                    if (actualCoursesthisClassroom.dataMorning.length > 0) {
                        actualDate = moment(actualCoursesthisClassroom.dataMorning[actualCoursesthisClassroom.dataMorning.length - 1].date);
                    } else {
                        actualDate = moment(firstDayStart);
                    }

                    //For Each Day, puts new Date
                    for (let z = 0; z < daysLengthThisCourse; z++) {
                        let dayAdded = false;

                        while (!dayAdded) {
                            actualDate.add(1, "days");
                            if (actualDate.format("dd") == "Sa" || actualDate.format("dd") == "Su" || festives.has(actualDate.format("Y-MM-DD"))) console.log("Dia Festivo o Fin de semana");
                            else {
                                actualCoursesthisClassroom.dataMorning.push(new DataCourse(x, actualDate.format("Y-MM-DD")))
                                dayAdded = true;
                            }
                        }
                    }

                    //If is Afternoon
                } else {
                    /*
                    let dataAfternoonMax: number | undefined = undefined;
                    //Let Classroom with less Days used
                    const classroomNumberToUse = coursesByClassrooms.reduce((numberReduced: number, h) => {
                        if (x.possibleClassrooms.find(o => h.classroom == o)) {
                            if (!dataAfternoonMax) {
                                dataAfternoonMax = h.dataAfternoon.length;
                                return h.classroom
                            } else {
                                if (h.dataAfternoon.length < dataAfternoonMax) {
                                    dataAfternoonMax = h.dataAfternoon.length;
                                    return h.classroom;
                                }

                                return numberReduced;
                            }
                        } else {
                            return numberReduced;
                        }
                    }, 0)
                    */
                    //Assign ActualCourseThisClassRoom
                    let actualCoursesthisClassroom = coursesByClassrooms.find(x => x.classroom == classroomNumberToUse) as CoursesByClassroom;

                    //Set First Day To Start in Moment Date
                    let actualDate: Moment
                    if (actualCoursesthisClassroom.dataAfternoon.length > 0) {
                        actualDate = moment(actualCoursesthisClassroom.dataAfternoon[actualCoursesthisClassroom.dataAfternoon.length - 1].date);
                    } else {
                        actualDate = moment(firstDayStart);
                    }

                    //For Each Day, puts new Date
                    for (let z = 0; z < daysLengthThisCourse; z++) {
                        let dayAdded = false;

                        while (!dayAdded) {
                            actualDate.add(1, "days");
                            if (actualDate.format("d") == "sat" || actualDate.format("d") == "sun" || festives.has(actualDate.format("Y-MM-DD"))) console.log("Dia Festivo o Fin de semana");
                            else {
                                actualCoursesthisClassroom.dataAfternoon.push(new DataCourse(x, actualDate.format("Y-MM-DD")))
                                dayAdded = true;
                            }
                        }
                    }
                }


            })
        }
    }

    console.log(coursesByClassrooms);
}

const coursesMap = courses.map((x, index) => {
    const possibleClassRoomsMap = [];
    for (let i = 1; i <= possibleClassRoms; i++) {
        possibleClassRoomsMap[i] = <div><label>{i}</label><input type="checkbox" checked={x.possibleClassrooms.find(x => i == x) ? true : false} onChange={(e) => updateCourse(e, index)} name={`possibleClassrooms`} value={i} /></div>

    }
    return (
        <div key={index}>
            <input type="text" value={x.name} onChange={(e: ChangeEvent) => { updateCourse(e, index) }} name="name" placeholder="Name" required />
            <input type="number" value={x.daysLength} onChange={(e: ChangeEvent) => { updateCourse(e, index) }} name="daysLength" placeholder="Days Length" required />
            {/*<input type="text" name="possibleClassrooms" onChange={(e:ChangeEvent)=>{updateCourse(e,index)}} placeholder="possibleClassRoms" required />*/}
            {possibleClassRoomsMap}
            <button onClick={() => { deleteCourse(index) }}>Delete</button>
        </div>
    );
})
return (
    <div>
        <div>
            <h2>Courses To Add</h2>
            <div>
                {coursesMap}
            </div>
            <button onClick={addNewCourse}>Add new Course</button>
            <div>
                <h3>Number of Classrooms</h3>
                <input type="number" onChange={onChangePossibleClassrooms} required></input>
                <button onClick={goMakeCalendar}>Make Calendar</button>
            </div>
        </div>
    </div>
);
}