import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { useRef } from "react";
import { Course } from "@/components/classes/courses/course";
import CoursesByClassroom from "@/components/classes/coursesByClassroom.ts/CoursesByClassroom";
import { FullCalendarEvent } from "@/components/classes/fullCalendar/event";

class Props {
    data:FullCalendarEvent[]=[]
    courses: Course[]=[] 
}

export default function CoursesCalendar (props:Props) {
    const calendarRef=useRef(null as FullCalendar|null);

    async function nextYear () {
        calendarRef.current?.getApi().nextYear();
    }

    return (
        <div>
            <FullCalendar ref={calendarRef}
                plugins={[multiMonthPlugin]}
                initialView="multiMonthYear"
                events={props.data}
            />
            <button onClick={nextYear}>hola</button>
        </div>
    );
}