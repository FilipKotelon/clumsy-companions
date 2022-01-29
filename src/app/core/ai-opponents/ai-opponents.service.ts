import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AvatarMainData } from '@core/avatars/avatars.types';
import { MessageService } from '@core/message/message.service';
import { combineLatest, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AIOpponent, AIOpponentMainData, AIOpponentQueryParams, AIOpponentWithThumbnail } from './ai-opponents.types';

@Injectable({
  providedIn: 'root'
})
export class AiOpponentsService {
  constructor(
    private fireStore: AngularFirestore,
    private messageSvc: MessageService,
    private router: Router
  ) { }

  getAIOpponents = (params?: AIOpponentQueryParams): Observable<AIOpponent[]> => {
    return this.fireStore.collection<AIOpponentMainData>('ai-opponents', ref => {
      let query: CollectionReference | Query = ref;

      if(params && params.playable !== null) {
        query = query.where('playable', '==', params.playable);
      }

      return query;
    }).get().pipe(
      map(aiOpponentDocs => {
        return aiOpponentDocs.docs.map(aiOpponentDoc => {
          return {
            ...aiOpponentDoc.data(),
            id: aiOpponentDoc.id
          }
        })
      }),
      catchError(error => {
        console.log(error);
        this.messageSvc.displayError('AIOpponents could not be loaded.');

        return [];
      })
    );
  }

  getAIOpponent = (id: string): Observable<AIOpponent> => {
    return this.fireStore.collection<AIOpponentMainData>('ai-opponents').doc(id).get().pipe(
      map(aiOpponentDoc => {
        if(aiOpponentDoc.data()){
          return {
            ...aiOpponentDoc.data(),
            id: aiOpponentDoc.id
          }
        } else {
          return null;
        }
      })
    );
  }

  getAiOpponentsWithThumbnails = (opponents: AIOpponent[]): Observable<AIOpponentWithThumbnail[]> => {
    const docRefs = opponents.map(opponent => this.fireStore.collection<AvatarMainData>('avatars').doc(opponent.avatarId).get());

    return combineLatest(docRefs)
      .pipe(
        map(docs => {
          return docs.map((doc, i) => ({
            ...opponents[i],
            imgUrl: doc.data().imgUrl
          }));
        })
      );
  }

  createAIOpponent = (data: AIOpponentMainData): void => {
    this.fireStore.collection<AIOpponentMainData>('ai-opponents').add(data).then(aiOpponentDoc => {
      this.messageSvc.displayInfo('The AI opponent was added successfully!');

      this.router.navigate([`/admin/ai-opponents/edit/${aiOpponentDoc.id}`]);
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while adding the AI opponent.');
    });
  }

  updateAIOpponent = (id: string, data: AIOpponentMainData): void => {
    this.fireStore.collection<AIOpponentMainData>('ai-opponents').doc(id).update({
      ...data
    }).then(() => {
      this.messageSvc.displayInfo('The AI opponent was updated successfully!');
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while updating the AI opponent.');
    });
  }

  deleteAIOpponent = (id: string, redirectPath?: string): void => {
    this.fireStore.collection<AIOpponentMainData>('ai-opponents').doc(id).delete()
      .then(() => {
        this.messageSvc.displayInfo('The AI opponent was deleted successfully!');

        if(redirectPath){
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([redirectPath]));
        }
      })
      .catch(error => {
        console.log(error);

        this.messageSvc.displayError('An error occurred while deleting this AI opponent.');
      });
  }
}
