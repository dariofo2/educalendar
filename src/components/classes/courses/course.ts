export class Course {
    name: string;
    daysLength: number;
    possibleClassrooms: number[];
    color: string;

    constructor (name:string,daysLength:number,possibleClassrooms:number[],color:string) {
        this.name=name;
        this.daysLength=daysLength;
        this.possibleClassrooms=possibleClassrooms;
        this.color=color;
    }
}