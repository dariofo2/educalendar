"use client"
import Image from "next/image";
import styles from "./page.module.css";
import ViewCourses from "@/components/courses/view/viewCourses";

export default function Home() {
  return (
    <div>
      <ViewCourses />
    </div>
  );
}
