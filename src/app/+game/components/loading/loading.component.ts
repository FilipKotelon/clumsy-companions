import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameLoaderService } from '@core/game/game-loader/game-loader.service';
import { fadeInOut } from '@shared/animations/component-animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  animations: [fadeInOut]
})
export class LoadingComponent implements OnInit, OnDestroy {
  isLoading = true;
  loadingSub: Subscription;
  loadingPercentageSub: Subscription;
  loadingPercentage = '0';

  constructor(private gameLoaderSvc: GameLoaderService) { }

  ngOnInit(): void {
    this.loadingSub = this.gameLoaderSvc.loadingFinished$.subscribe(loaded => {
      if(loaded){
        setTimeout(() => {
          this.isLoading = false;
          this.loadingSub.unsubscribe();
        }, 300);
      }
    });

    this.loadingPercentageSub = this.gameLoaderSvc.loadingPercentage$.subscribe(loadingPercentage => {
      console.log(loadingPercentage);
      this.loadingPercentage = loadingPercentage;
    });
  }

  ngOnDestroy(): void {
    this.loadingSub.unsubscribe();
    this.loadingPercentageSub.unsubscribe();
  }
}
