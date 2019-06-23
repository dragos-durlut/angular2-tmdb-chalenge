import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: "rating-system",
    templateUrl: "./rating-system.component.html",
    styleUrls: ["./rating-system.component.scss"]
})
export class RatingSystemComponent {
    
    @Input() initialValue: number;
    @Output() onChange: EventEmitter<any> = new EventEmitter();

    @Input()  ratings: Array<number>;
    
    constructor() {
        this.ratings = [];
    }

    public ngOnInit(): void {
    }

    public onFilterChange(rating: number): void {
        this.onChange.emit(rating);
    }
}