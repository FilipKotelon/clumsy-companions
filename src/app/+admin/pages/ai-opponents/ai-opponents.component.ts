import { Component, OnInit } from '@angular/core';
import { AiOpponentsService } from '@core/ai-opponents/ai-opponents.service';
import { AIOpponent, AIOpponentWithThumbnail } from '@core/ai-opponents/ai-opponents.types';

@Component({
  selector: 'app-ai-opponents',
  templateUrl: './ai-opponents.component.html',
  styleUrls: ['./ai-opponents.component.scss']
})
export class AiOpponentsComponent implements OnInit {
  private idToDelete = '';

  aiOpponents: AIOpponentWithThumbnail[];
  deletePopupOpen: boolean;

  constructor(
    private aiOpponentsSvc: AiOpponentsService
  ) { }

  ngOnInit(): void {
    this.aiOpponentsSvc.getAIOpponents().subscribe(aiOpponents => {
      this.aiOpponentsSvc.getAiOpponentsWithThumbnails(aiOpponents).subscribe(finalOpponents => {
        this.aiOpponents = finalOpponents;
      });
    });
  }

  onOpenDeletePopup = (id: string): void => {
    this.deletePopupOpen = true;
    this.idToDelete = id;
  }

  closeDeletePopup = (): void => {
    this.deletePopupOpen = false;
    this.idToDelete = '';
  }

  deleteAIOpponent = (): void => {
    this.aiOpponentsSvc.deleteAIOpponent(this.idToDelete, '/admin/ai-opponents');
    this.closeDeletePopup();
  }
}
