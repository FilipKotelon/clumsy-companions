import { Injectable } from '@angular/core';
import { CardFight, GameCanvasDataItem } from '../game.types';

@Injectable({
  providedIn: 'root'
})
export class GameCanvasService {
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  data: GameCanvasDataItem[] = [];

  constructor() {}

  init = (): void => {
    this.canvas = document.getElementById('game-canvas-overlay') as HTMLCanvasElement;
    this.canvasCtx = this.canvas.getContext('2d');
  }

  reset = (): void => {
    this.canvas = null;
    this.canvasCtx = null;
    this.data = null;
  }

  setFightsToDrawBetween = (fights: CardFight[]): void => {
    if(!this.canvas) return;
    this.data = [];

    fights.forEach(fight => {
      const attackerEl = document.getElementById(fight.attacker.gameObjectId);
      const defenderEl = document.getElementById(fight.defender.gameObjectId);
      const attackerElRect = attackerEl.getBoundingClientRect();
      const defenderElRect = defenderEl.getBoundingClientRect();

      let attackerElX = attackerElRect.left + attackerElRect.width / 2;
      let attackerElY = attackerElRect.top + attackerElRect.height / 2;
      let defenderElX = defenderElRect.left + defenderElRect.width / 2;
      let defenderElY = defenderElRect.top + defenderElRect.height / 2;

      this.data.push({
        attackerX: attackerElX,
        attackerY: attackerElY,
        defenderX: defenderElX,
        defenderY: defenderElY
      });
    });

    this.draw();
  }

  clear = (): void => {
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw = (): void => {
    if(!this.canvas) return;

    this.canvas.width  = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.data.forEach(item => {
      this.canvasCtx.lineCap = 'round';
      this.canvasCtx.lineWidth = 5;
      this.canvasCtx.strokeStyle = '#F2994A';

      this.canvasCtx.beginPath();
      this.canvasCtx.moveTo(item.attackerX, item.attackerY);
      this.canvasCtx.lineTo(item.defenderX, item.defenderY);
      this.canvasCtx.stroke();
    });
  }
}
