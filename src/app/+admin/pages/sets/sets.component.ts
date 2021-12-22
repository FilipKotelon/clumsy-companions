import { SetsService } from './../../../core/sets/sets.service';
import { Component, OnInit } from '@angular/core';
import { Set } from '@core/sets/sets.types';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html',
  styleUrls: ['./sets.component.scss']
})
export class SetsComponent implements OnInit {
  sets: Set[];

  constructor(
    private setsSvc: SetsService
  ) { }

  ngOnInit(): void {
    this.setsSvc.getSets().subscribe(sets => {
      this.sets = sets;
      console.log(this.sets);
    })
  }

  onDelete = (id: string): void => {
    console.log(id);
  }
}
