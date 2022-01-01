import { Component, OnInit } from '@angular/core';

import { Pack } from '@core/packs/packs.types';
import { PacksService } from '@core/packs/packs.service';

@Component({
  selector: 'app-packs',
  templateUrl: './packs.component.html',
  styleUrls: ['./packs.component.scss']
})
export class PacksComponent implements OnInit {
  private idToDelete = '';

  deletePopupOpen: boolean;
  packs: Pack[];

  constructor(
    private packsSvc: PacksService
  ) { }

  ngOnInit(): void {
    this.packsSvc.getPacks().subscribe(packs => {
      this.packs = packs;
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

  deletePack = (): void => {
    this.packsSvc.deletePack(this.idToDelete, '/admin/packs');
    this.closeDeletePopup();
  }
}
