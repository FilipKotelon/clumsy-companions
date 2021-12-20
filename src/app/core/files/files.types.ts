import { Observable } from 'rxjs';

export interface FileUploadResponse {
  percentage$: Observable<number>;
  fileUrl$: Observable<string>;
}