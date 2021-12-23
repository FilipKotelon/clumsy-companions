import { Component, EventEmitter, forwardRef, Input, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';

import { InputComponent } from '@shared/utility/input-component.class';
import { FilesService } from '@core/files/files.service';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { fadeInOut } from '@app/shared/animations/component-animations';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FileUploadComponent),
  multi: true
};

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  animations: [fadeInOut],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class FileUploadComponent extends InputComponent implements OnDestroy {
  @Input() imgUrl?: string;
  @Input() path: string;
  @Input() displayText: string;

  @Output() uploaded = new EventEmitter<void>();

  uploading = false;
  uploadPercentage = 0;
  
  imgsToDelete: string[];
  originalImgUrl: string;
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
      
      this.uploaded.emit();
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
