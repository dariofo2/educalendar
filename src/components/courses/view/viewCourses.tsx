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
    const festives = new Set<string>(["2025-10-20", "2025-08-25"]);
    const [firstDayStart, setFirstDayStart] = useState("2025-9-15");

    const [eventsData,setEventsData]=useState(null as FullCalendarEvent[]|null);
    let coursesByClassrooms: CoursesByClassroom[] = [];

    function addNewCourse() {
        setCourses([...courses, new Course("", 0, [],"#000000")]);
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

    function shuffleCoursesAndMakeCalendar () {
        const shuffled=shuffleArray(courses as []);
        setCourses([...shuffled]);

        setTimeout(() => {
            goMakeCalendar();    
        }, 100);
    }

    function shuffleArray (array:[]) {
        for (const key in array) {
            const cache=array[key];
            const randomIndex=Math.floor(Math.random()*array.length);

            array[key]=array[randomIndex];
            array[randomIndex]=cache;
        }
        return array;
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

        const eventsDataToAdd: FullCalendarEvent[]=[]
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
                    let dataMorningOrAfternoonMax: number | null = null;
                    let classroomNumberToUse = 0;
                    //Check Class and if is Morning or Afternoon
                    coursesByClassrooms.forEach((h) => {
                        let foundClassRoom=false;
                        console.log(dataMorningOrAfternoonMax);
                        //console.log(h.dataMorning.length)
                        if (x.possibleClassrooms.find(o => h.classroom == o)) {
                            if (dataMorningOrAfternoonMax==null) {
                                dataMorningOrAfternoonMax = h.dataMorning.length;
                                console.log("FIRSTT")
                                isMorning = true;
                                foundClassRoom=true;
                            }
                            if (h.dataMorning.length < dataMorningOrAfternoonMax) {
                                dataMorningOrAfternoonMax = h.dataMorning.length;
                                isMorning = true;
                                foundClassRoom=true;
                            }
                            if (h.dataAfternoon.length < dataMorningOrAfternoonMax) {
                                dataMorningOrAfternoonMax = h.dataAfternoon.length;
                                isMorning = false;
                                foundClassRoom=true;
                            }
                            if (foundClassRoom) classroomNumberToUse = h.classroom;
                        } else {
                            
                        }
                    });

                const daysLengthThisCourse = x.daysLength;
                //let daysCount=0; No lo vamos a necesitar

                //If is morning
                if (isMorning) {
                    
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
                    }
                }


            })
        }
    }

    console.log(coursesByClassrooms);
    setEventsData([...eventsDataToAdd]);
    //setCoursesByClassRoomsState({...coursesByClassrooms});
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
            <input type="color" value={x.color} onChange={(e: ChangeEvent) => { updateCourse(e, index) }} name="color" placeholder="Color" required />
            {/*<input type="text" name="possibleClassrooms" onChange={(e:ChangeEvent)=>{updateCourse(e,index)}} placeholder="possibleClassRoms" required />*/}
            {possibleClassRoomsMap}
            <button onClick={() => { deleteCourse(index) }}>Delete</button>
        </div>
    );
})
return (
    <div>
        <div>
            <h1 className="text-center">Edu Calendar APP</h1>
            <h2>Courses To Add</h2>
            <div>
                {coursesMap}
            </div>
            <button onClick={addNewCourse}>Add new Course</button>
            <div>
                <h3>Number of Classrooms</h3>
                <input type="number" onChange={onChangePossibleClassrooms} required></input>
                <button onClick={goMakeCalendar} disabled={possibleClassRoms<=0 ? true : false} >Make Calendar</button>
                <button onClick={shuffleCoursesAndMakeCalendar} disabled={possibleClassRoms<=0 ? true : false} >Try Random Combination</button>
            </div>
        </div>
        <CoursesCalendar courses={courses} data={eventsData as FullCalendarEvent[]} initialDate={moment(firstDayStart).format("Y-MM-01")} />
    </div>
);
}