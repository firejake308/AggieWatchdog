import Course from "./Course";

export default interface Section {
    course: Course;
    sectionNum: string;
    professor: string; 
    seatsOpen: number;
    seatsTotal: number;
    watched: boolean;
}