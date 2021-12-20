import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { InputComponent } from '@shared/utility/input-component.class';
import { FilesService } from '@core/files/files.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent extends InputComponent implements OnDestroy {
  @Input() imgUrl?: string;
  @Input() path: string;
  @Input() displayText: string;

  uploading = false;
  uploadPercentage = 0;
  
  uploadPercentageSub: Subscription;
  uploadSub: Subscription;

  constructor(
    private filesService: FilesService
  ) {
    super();
  }

  ngOnDestroy() {
    this.clearSubs();
  }

  uploadImg = (e: Event) => {
    this.clearSubs()

    const input = (<HTMLInputElement>e.target);
    const imgFile = input.files[0];

    if(!imgFile){
      return;
    }
  
    const imgToDelete = this.imgUrl;
    this.uploading = true;

    const uploadRes = this.filesService.uploadFile(imgFile, this.path, input.value, imgToDelete);

    this.uploadPercentageSub = uploadRes.percentage$.subscribe(percentage => {
      this.uploadPercentage = percentage;
    })

    this.uploadSub = uploadRes.fileUrl$.subscribe(url => {
      this.imgUrl = url;
      this.onChange(e, url);
      this.uploading = false;
    })
  }

  clearSubs = () => {
    if(this.uploadPercentageSub){
      this.uploadPercentageSub.unsubscribe();
    }
    if(this.uploadSub){
      this.uploadSub.unsubscribe();
    }
  }
}
