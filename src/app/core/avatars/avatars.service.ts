import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference, Query } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';

import { FilesService } from '@core/files/files.service';
import { MessageService } from '@core/message/message.service';

import { Avatar, AvatarMainData, AvatarQueryParams } from './avatars.types';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AvatarsService {
  constructor(
    private fireStore: AngularFirestore,
    private filesSvc: FilesService,
    private messageSvc: MessageService,
    private router: Router
  ) { }

  getAvatars = (params: AvatarQueryParams = {}): Observable<Avatar[]> => {
    if(params.ids?.length){
      const docRefs = params.ids.map(id => this.fireStore.collection<AvatarMainData>('avatars').doc(id).get());

      return combineLatest(docRefs).pipe(
        map(avatarDocs => {
          let avatars = avatarDocs.map(avatarDoc => {
            return {
              ...avatarDoc.data(),
              id: avatarDoc.id
            }
          });

          if(params.visibleInShop){
            avatars = avatars.filter(avatar => avatar.visibleInShop);
          }

          if(params.names?.length){
            avatars = avatars.filter(avatar => params.names.includes(avatar.name));
          }

          return avatars;
        }),
        catchError(error => {
          console.log(error);
          this.messageSvc.displayError('Avatars could not be loaded.');
  
          return [];
        })
      );
    }

    return this.fireStore.collection<AvatarMainData>('avatars').get().pipe(
      map(avatarDocs => {
        let avatars = avatarDocs.docs.map(avatarDoc => {
          return {
            ...avatarDoc.data(),
            id: avatarDoc.id
          }
        });

        if(params.visibleInShop){
          avatars = avatars.filter(avatar => avatar.visibleInShop);
        }

        if(params.names?.length){
          avatars = avatars.filter(avatar => params.names.includes(avatar.name));
        }

        return avatars;
      }),
      catchError(error => {
        console.log(error);
        this.messageSvc.displayError('Avatars could not be loaded.');

        return [];
      })
    );
  }

  getAvatar = (id: string): Observable<Avatar> => {
    return this.fireStore.collection<AvatarMainData>('avatars').doc(id).get().pipe(
      map(avatarDoc => {
        if(avatarDoc.data()){
          return {
            ...avatarDoc.data(),
            id: avatarDoc.id
          }
        } else {
          return null;
        }
      })
    );
  }

  createAvatar = (data: AvatarMainData): void => {
    this.fireStore.collection<AvatarMainData>('avatars').add(data).then(avatarDoc => {
      this.messageSvc.displayInfo('The avatar was added successfully!');

      this.router.navigate([`/admin/avatars/edit/${avatarDoc.id}`]);
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while adding the avatar.');
    });
  }

  updateAvatar = (id: string, data: AvatarMainData): void => {
    this.fireStore.collection<AvatarMainData>('avatars').doc(id).update({
      ...data
    }).then(() => {
      this.messageSvc.displayInfo('The avatar was updated successfully!');
    }).catch(error => {
      console.log(error);

      this.messageSvc.displayError('An error occurred while updating the avatar.');
    });
  }

  deleteAvatar = (id: string, redirectPath?: string): void => {
    this.fireStore.collection<AvatarMainData>('avatars').doc(id).get().subscribe(avatarDoc => {
      const imgUrl = avatarDoc.data().imgUrl;
      
      this.fireStore.collection<AvatarMainData>('avatars').doc(id).delete()
        .then(() => {
          this.messageSvc.displayInfo('The avatar was deleted successfully!');

          this.filesSvc.deleteFile(imgUrl);

          if(redirectPath){
            this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => this.router.navigate([redirectPath]));
          }
        })
        .catch(error => {
          console.log(error);

          this.messageSvc.displayError('An error occurred while deleting this avatar.');
        });
    });
  }
}
