import { SetsService } from './../../../core/sets/sets.service';
import { Component, OnInit } from '@angular/core';
import { Set } from '@core/sets/sets.types';

@Component({
  selector: 'app-sets',
  templateUrl: './sets.component.html',
  styleUrls: ['./sets.component.scss']
})
export class SetsComponent implements OnInit {
  private idToDelete = '';

  deletePopupOpen: boolean;
  sets: Set[];

  constructor(
    private setsSvc: SetsService
  ) { }

  ngOnInit(): void {
    this.setsSvc.getSets().subscribe(sets => {
      this.sets = sets;
    })
  }

  onOpenDeletePopup = (id: string): void => {
    this.deletePopupOpen = true;
    this.idToDelete = id;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
    this.idToDelete = '';
  }

  deleteSet = (): void => {
    this.setsSvc.deleteSet(this.idToDelete, '/admin/sets');
    this.closeDeletePopup();
  }
}
