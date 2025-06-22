export class Course {
    name: string;
    daysLength: number;
    possibleClassrooms: number[];

    constructor (name:string,daysLength:number,possibleClassrooms:number[]) {
        this.name=name;
        this.daysLength=daysLength;
        this.possibleClassrooms=possibleClassrooms;
    }
}