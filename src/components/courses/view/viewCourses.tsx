"use client"
import { Course } from "@/components/classes/courses/course";
import { ChangeEvent, useState } from "react";

export default function ViewCourses () {
    const [courses,setCourses]=useState([] as Course[]);
    const [possibleClassRoms,setPossibleClassrooms]=useState(0);

    function addNewCourse () {
        setCourses([...courses,new Course("",0,[])]);
        console.log(courses);
    }

    function deleteCourse (id:number) {
        const coursesWithoutDeleted=courses.filter((x,index)=>{
            if (index!=id) return x;
        })
        setCourses([...coursesWithoutDeleted]);
    }

    function updateCourse (e:ChangeEvent,id:number) {
        const inputElem=e.target as HTMLInputElement;
        let coursesCopy= [...courses];

        const courseFound=coursesCopy.find((x,index)=>{
            if (index==id) return x; 
        })

        if (courseFound) {
            if (inputElem.name=="possibleClassrooms") {
                if (inputElem.checked) {
                    //console.log(inputElem.value);
                    courseFound.possibleClassrooms.push(parseInt(inputElem.value));
                    //console.log(courseFound);
                } else {
                    courseFound.possibleClassrooms=courseFound.possibleClassrooms.filter(x=>{
                        if (x!=parseInt(inputElem.value)) return x;
                    })
                    //console.log(courseFound)
                }
                
            } else {
                (courseFound as any)[inputElem.name]=inputElem.value;
            }
        }
        
        
        setCourses([...coursesCopy]);
    }

    function onChangePossibleClassrooms (e:ChangeEvent) {
        const inputElem= e.target as HTMLInputElement;
        setPossibleClassrooms(parseInt(inputElem.value));
    }

    function goMakeCalendar () {

    }

    const coursesMap= courses.map((x,index)=>{
        const possibleClassRoomsMap=[];
        for (let i = 1; i <= possibleClassRoms; i++) {
            possibleClassRoomsMap[i]=<div><label>{i}</label><input type="checkbox" onChange={(e)=>updateCourse(e,index)} name={`possibleClassrooms`} value={i} /></div>
            
        }
        return (
            <div>
                <input type="text" value={x.name} onChange={(e:ChangeEvent)=>{updateCourse(e,index)}} name="name" placeholder="Name" required />
                <input type="number" value={x.daysLength} onChange={(e:ChangeEvent)=>{updateCourse(e,index)}} name="daysLength" placeholder="Days Length" required />
                {/*<input type="text" name="possibleClassrooms" onChange={(e:ChangeEvent)=>{updateCourse(e,index)}} placeholder="possibleClassRoms" required />*/}
                {possibleClassRoomsMap}
                <button onClick={()=>{deleteCourse(index)}}>Delete</button>
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