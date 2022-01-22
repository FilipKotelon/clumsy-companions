import { Component, OnInit } from '@angular/core';
import { SleevesService } from '@core/sleeves/sleeves.service';
import { Sleeve } from '@core/sleeves/sleeves.types';

@Component({
  selector: 'app-sleeves',
  templateUrl: './sleeves.component.html',
  styleUrls: ['./sleeves.component.scss']
})
export class SleevesComponent implements OnInit {
  private idToDelete = '';

  deletePopupOpen: boolean;
  sleeves: Sleeve[];

  constructor(
    private sleevesSvc: SleevesService
  ) { }

  ngOnInit(): void {
    this.sleevesSvc.getSleeves().subscribe(sleeves => {
      this.sleeves = sleeves;
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

  deleteSleeve = (): void => {
    this.sleevesSvc.deleteSleeve(this.idToDelete, '/admin/sleeves');
    this.closeDeletePopup();
  }
}
