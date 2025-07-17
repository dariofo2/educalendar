"use client"
import { Course } from "@/components/classes/courses/course";
import CoursesByClassroom from "@/components/classes/coursesByClassroom.ts/CoursesByClassroom";
import { DataCourse } from "@/components/classes/coursesByClassroom.ts/dataCourse";
import moment, { Moment } from "moment";
import { ChangeEvent, useState } from "react";
import CoursesCalendar from "../calendar/coursesCalendar";
import { FullCalendarEvent } from "@/components/classes/fullCalendar/event";

export default function ViewCourses() {
    const [courses, setCourses] = useState([] as Course[]);
    const [possibleClassRoms, setPossibleClassrooms] = useState(0);
    const festives = new Set<string>(["2025-12-08", "2025-12-22","2025-12-23","2025-12-24","2025-12-25","2025-12-26","2025-12-27","2025-12-28","2025-12-29","2025-12-30","2025-12-31","2026-01-01","2026-01-02","2026-01-03","2026-01-04","2026-01-05","2026-01-06", "2026-02-16","2026-02-17","2026-03-19","2026-04-02","2026-04-03","2026-05-01","2026-06-24"]);
    const [firstDayStart, setFirstDayStart] = useState("2025-09-15");
    const [lastDayFinish, setLastDayFinish] = useState("2026-09-12");

    const [eventsData, setEventsData] = useState(null as FullCalendarEvent[] | null);
    let coursesByClassrooms: CoursesByClassroom[] = [];

    function addNewCourse() {
        setCourses([...courses, new Course("", 0, [], "#000000")]);
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

    function shuffleCoursesAndMakeCalendar() {
        const shuffled = shuffleArray(courses as []);
        setCourses([...shuffled]);

        setTimeout(() => {
            goMakeCalendar();
        }, 100);
    }

    function shuffleArray(array: []) {
        for (const key in array) {
            const cache = array[key];
            const randomIndex = Math.floor(Math.random() * array.length);

            array[key] = array[randomIndex];
            array[randomIndex] = cache;
        }
        return array;
    }

    function onChangeDates (e:ChangeEvent) {
        const inputElem=e.target as HTMLInputElement
        switch (inputElem.name) {
            case "startDate":
                const newDateStart=moment(inputElem.value).format("Y-MM-DD")
                console.log(newDateStart);
                setFirstDayStart(newDateStart);
                break;
            case "endDate":
                const newDateFinish=moment(inputElem.value).format("Y-MM-DD")
                console.log(newDateFinish);
                setLastDayFinish(newDateFinish);
                break;
        }
    }
    //2 times in a same classroom, Morning and Afternoon
    //First check first courses with less possibleClassRooms
    //1 Morning 1 Afternoon
    function goMakeCalendar() {
        //Create CoursesByClassrooms 
        coursesByClassrooms = [];
        for (let i = 0; i < possibleClassRoms; i++) {
            coursesByClassrooms.push(new CoursesByClassroom(i + 1));
        }

        const eventsDataToAdd: FullCalendarEvent[] = []
        //Get Courses first by 1 Classroom, 2nd 2 Classrooms and keep going
        for (let i = 0; i < possibleClassRoms; i++) {
            const coursesFiltered = courses.filter(x => x.possibleClassrooms.length == i + 1)

            let isMorning = true;
            
            if (coursesFiltered.length > 0) {

                //For each Course, assign days
                coursesFiltered.forEach(x => {
                    //Check Class and if is Morning or Afternoon
                    let dataMorningOrAfternoonMax: number | null = null;
                    let classroomNumberToUse = 0;
                    let foundDay = false;
                    //Check Classes Morning
                    coursesByClassrooms.forEach((h) => {
                        let foundClassRoom = false;
                        console.log(dataMorningOrAfternoonMax);
                        //console.log(h.dataMorning.length)
                        if (x.possibleClassrooms.find(o => h.classroom == o)) {
                            //Check Mornings
                            const dateStartToCheck = h.dataMorning.length > 0 ? h.dataMorning[h.dataMorning.length - 1].date : firstDayStart;

                            if (dataMorningOrAfternoonMax == null && !isPassedMaxDay(dateStartToCheck, lastDayFinish, x.daysLength)) {
                                dataMorningOrAfternoonMax = h.dataMorning.length;
                                console.log("FIRSTT")
                                isMorning = true;
                                foundClassRoom = true;
                                foundDay = true;
                            }
                            if (h.dataMorning.length < (dataMorningOrAfternoonMax ?? -5) && !isPassedMaxDay(dateStartToCheck, lastDayFinish, x.daysLength)) {
                                dataMorningOrAfternoonMax = h.dataMorning.length;
                                isMorning = true;
                                foundClassRoom = true;
                                foundDay = true;
                            }
                            /*
                            if (h.dataAfternoon.length < dataMorningOrAfternoonMax) {
                                dataMorningOrAfternoonMax = h.dataAfternoon.length;
                                isMorning = false;
                                foundClassRoom = true;
                            }
                            */
                            if (foundClassRoom) {
                                classroomNumberToUse = h.classroom;
                                //Check Afternoons Cause no Mornings
                            } else {
                            }
                        }
                    });

                    console.log(foundDay);
                    //Check Afternoons
                    if (!foundDay) {
                        coursesByClassrooms.forEach((h) => {
                            let foundClassRoom = false;
                            const dateStartToCheck = h.dataAfternoon.length > 0 ? h.dataAfternoon[h.dataAfternoon.length - 1].date : firstDayStart;
                            console.log("Checking afternoons")
                            console.log(dataMorningOrAfternoonMax);
                            //console.log(h.dataMorning.length)
                            if (x.possibleClassrooms.find(o => h.classroom == o)) {
                                //Check Mornings
                                if (dataMorningOrAfternoonMax == null && !isPassedMaxDay(dateStartToCheck, lastDayFinish, x.daysLength)) {
                                    dataMorningOrAfternoonMax = h.dataAfternoon.length;
                                    console.log("FIRSTT")
                                    isMorning = false;
                                    foundClassRoom = true;
                                }
                                if (h.dataAfternoon.length < (dataMorningOrAfternoonMax ?? 5000000) && !isPassedMaxDay(dateStartToCheck, lastDayFinish, x.daysLength)) {
                                    dataMorningOrAfternoonMax = h.dataAfternoon.length;
                                    isMorning = false;
                                    foundClassRoom = true;
                                }

                                if (foundClassRoom) {
                                    classroomNumberToUse = h.classroom;
                                } else {
                                    //console.log("All Classrooms are Busy");
                                }
                            }
                        });
                    }



                    // Make Days
                    x.classRoomUsed = classroomNumberToUse;

                    const daysLengthThisCourse = x.daysLength;
                    //let daysCount=0; No lo vamos a necesitar

                    //If is morning
                    if (isMorning) {

                        console.log(classroomNumberToUse);
                        console.log(classroomNumberToUse);
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

                        x.dateStart = actualDate.format("Y-MM-DD");
                        //For Each Day, puts new Date
                        for (let z = 0; z < daysLengthThisCourse; z++) {
                            let dayAdded = false;

                            while (!dayAdded) {
                                actualDate.add(1, "days");
                                if (actualDate.format("dd") == "Sa" || actualDate.format("dd") == "Su" || festives.has(actualDate.format("Y-MM-DD"))) console.log("Dia Festivo o Fin de semana");
                                else {
                                    actualCoursesthisClassroom.dataMorning.push(new DataCourse(x, actualDate.format("Y-MM-DDT09:00:00")))
                                    eventsDataToAdd?.push({
                                        title: `${actualCoursesthisClassroom.classroom} ${x.name}`,
                                        color: x.color,
                                        start: actualDate.format("Y-MM-DDT09:00:00"),
                                        classroom: actualCoursesthisClassroom.classroom
                                    })
                                    dayAdded = true;
                                }
                            }
                            x.dateEnd = actualDate.format("Y-MM-DD");
                        }

                        //If is Afternoon
                    } else {
                        //Assign ActualCourseThisClassRoom
                        let actualCoursesthisClassroom = coursesByClassrooms.find(x => x.classroom == classroomNumberToUse) as CoursesByClassroom;

                        //Set First Day To Start in Moment Date
                        let actualDate: Moment
                        if (actualCoursesthisClassroom.dataAfternoon.length > 0) {
                            actualDate = moment(actualCoursesthisClassroom.dataAfternoon[actualCoursesthisClassroom.dataAfternoon.length - 1].date);
                        } else {
                            actualDate = moment(firstDayStart);
                        }
                        x.dateStart = actualDate.format("Y-MM-DD");

                        //For Each Day, puts new Date
                        for (let z = 0; z < daysLengthThisCourse; z++) {
                            let dayAdded = false;

                            while (!dayAdded) {
                                actualDate.add(1, "days");
                                if (actualDate.format("dd") == "Sa" || actualDate.format("dd") == "Su" || festives.has(actualDate.format("Y-MM-DD"))) console.log("Dia Festivo o Fin de semana");
                                else {
                                    actualCoursesthisClassroom.dataAfternoon.push(new DataCourse(x, actualDate.format("Y-MM-DDT09:00:00")));

                                    eventsDataToAdd.push({
                                        title: `${actualCoursesthisClassroom.classroom} ${x.name}`,
                                        color: x.color,
                                        start: actualDate.format("Y-MM-DDT15:00:00"),
                                        classroom: actualCoursesthisClassroom.classroom
                                    });

                                    dayAdded = true;
                                }
                            }

                            x.dateEnd = actualDate.format("Y-MM-DD");
                        }
                    }


                })
            }
        }

        console.log(coursesByClassrooms);
        setEventsData([...eventsDataToAdd]);
        //setCoursesByClassRoomsState({...coursesByClassrooms});
    }

    function isPassedMaxDay(dateStart: string, maxDateEnd: string, days: number) {
        let actualDate = moment(dateStart);
        let maxDateEndMoment = moment(maxDateEnd);

        for (let i = 0; i < days; i++) {
            let dayAdded = false;

            while (!dayAdded) {
                actualDate.add(1, "days");
                if (actualDate.format("dd") != "Sa" && actualDate.format("dd") != "Su" && !festives.has(actualDate.format("Y-MM-DD"))) {
                    dayAdded = true;
                }
            }
        }

        if (parseInt(actualDate.format("X")) > parseInt(maxDateEndMoment.format("X"))) return true;
        else return false;
    }

    const coursesMap = courses.map((x, index) => {
        const possibleClassRoomsMap = [];
        for (let i = 1; i <= possibleClassRoms; i++) {
            possibleClassRoomsMap[i] = <div className="form-check ms-3 me-3"><label className="form-check-label">{i}</label><input className="form-check-input" type="checkbox" checked={x.possibleClassrooms.find(x => i == x) ? true : false} onChange={(e) => updateCourse(e, index)} name={`possibleClassrooms`} value={i} /></div>

        }
        return (
            <div className="container" key={index}>
                <div className="row align-items-center justify-content-center">
                    <div className="col-5">
                        <div className="form-floating">
                            <input className="form-control" type="text" value={x.name} onChange={(e: ChangeEvent) => { updateCourse(e, index) }} name="name" placeholder="Name" required />
                            <label className="form-label">Name</label>
                        </div>
                    </div>
                    <div className="col-2">
                        <div className="form-floating">
                            <input className="form-control" type="number" value={x.daysLength} onChange={(e: ChangeEvent) => { updateCourse(e, index) }} name="daysLength" placeholder="Days Length" required />
                            <label className="form-label">Days Length</label>
                        </div>
                    </div>
                    <div className="col-1">
                        <input className="form-control-color w-100" type="color" value={x.color} onChange={(e: ChangeEvent) => { updateCourse(e, index) }} name="color" placeholder="Color" required />
                    </div>
                    <div className="col-2">
                        <button className="btn btn-danger w-100" onClick={() => { deleteCourse(index) }}>Delete</button>
                    </div>
                </div>
                <div className="d-flex justify-content-center mt-3">
                    <h6>Possible Classrooms: </h6>
                    {possibleClassRoomsMap}
                </div>

                <hr />
            </div>
        );
    })
    return (
        <div>
            <div>
                <h1 className="display-1 text-center">Edu Calendar APP</h1>
                <h3 className="text-center">Start/End Dates</h3>
                <label className="form-label">Start Day</label>
                <input className="form-control" value={firstDayStart} type="date" name="startDate" onChange={onChangeDates}></input>
                <label className="form-label">End Day</label>
                <input className="form-control" type="date" value={lastDayFinish} name="endDate" onChange={onChangeDates}></input>
                <h3 className="text-center">Number of Classrooms</h3>
                <input className="form-control m-auto" style={{ maxWidth: 300 }} type="number" defaultValue={0} onChange={onChangePossibleClassrooms} required></input>
                <h2 className="text-center">Courses To Add</h2>
                <div>
                    {coursesMap}
                </div>
                <div className="text-center">
                    <button className="btn btn-primary" onClick={addNewCourse}>Add new Course</button>
                </div>
                <div className="text-center mt-5">
                    <button className="btn btn-primary" onClick={goMakeCalendar} disabled={possibleClassRoms <= 0 ? true : false} >Make Calendar</button>
                    <button className="btn btn-primary" onClick={shuffleCoursesAndMakeCalendar} disabled={possibleClassRoms <= 0 ? true : false} >Try Random Combination</button>
                </div>
            </div>
            <CoursesCalendar courses={courses} data={eventsData as FullCalendarEvent[]} initialDate={moment(firstDayStart).format("Y-MM-01")} />
        </div>
    );
}