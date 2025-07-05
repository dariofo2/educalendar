import FullCalendar from "@fullcalendar/react";
import DayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { useRef } from "react";
import { Course } from "@/components/classes/courses/course";
import CoursesByClassroom from "@/components/classes/coursesByClassroom.ts/CoursesByClassroom";
import { FullCalendarEvent } from "@/components/classes/fullCalendar/event";
import * as reactpdf from "react-pdf";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
class Props {
    data: FullCalendarEvent[] = []
    courses: Course[] = []
    initialDate = "2025-09-01"
}

export default function CoursesCalendar(props: Props) {
    const calendarRef = useRef(null as FullCalendar | null);

    async function nextYear() {
        //calendarRef.current?.getApi().nextYear();
        console.log(props.initialDate)
        calendarRef.current?.getApi().gotoDate(props.initialDate);
        
        downloadPDF();
    }

    async function downloadPDF() {
        //var printWindow = window.open('', '', 'height=400,width=800');
        //console.log();
        //printWindow?.document.write(document.getElementById("calendarDiv")?.getHTML() as string)
        //calendarRef.current?.getApi().gotoDate(props.initialDate);
        //const canvas = await html2canvas(document.getElementById("calendarDiv") as HTMLElement);
        //const img=canvas.toDataURL("image/png");
        //const imgElem=new Image();
        //imgElem.src=img;
        //imgElem.onload=async ()=>{
            const jspdf = new jsPDF({
            orientation:"l",
            unit:"px"
        });
        
        
        for (let i = 0; i < 13; i++) {
            const canvas = await html2canvas(document.getElementById("calendarDiv") as HTMLElement);
            const img=canvas.toDataURL("image/png");
            const canvasHeight=canvas.height;
            
            const imgProps = jspdf.getImageProperties(img);
            const pdfWidth = jspdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            jspdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
            if (i!=13-1) {
                jspdf.addPage();
            }
            
            calendarRef.current?.getApi().next();
            
        }
        
        jspdf.save();
        
    }

    const leyendCourses=props.courses.map(x=>{
        return (
            <div className="d-flex me-3">
                {x.name}
                <div style={{width:50, height:25, backgroundColor:x.color}}></div>
            </div>
        );
    })
    return (
        <div id="calendarDiv">
            <div className="d-flex">
                {leyendCourses}
            </div>
            <FullCalendar ref={calendarRef}
                plugins={[DayGridPlugin]}
                multiMonthMaxColumns={1}
                height= "auto"
                contentHeight={"auto"}
                eventMaxStack={10}
                events={props.data}

            />
            <button onClick={nextYear}>hola</button>
        </div>
    );
}