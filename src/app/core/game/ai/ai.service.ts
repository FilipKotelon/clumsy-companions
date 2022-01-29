import { Injectable } from '@angular/core';
import { SelectControlOption } from '@shared/components/controls/select-control/select-control.types';
import { AIDifficulty } from './ai.types';

@Injectable({
  providedIn: 'root'
})
export class AiService {

  constructor() { }

  getAiDifficultySelectOptions = (): SelectControlOption[] => {
    return [
      {
        key: '',
        value: 'Select AI difficulty'
      },
      ...Object.keys(AIDifficulty).map(key => ({
        key,
        value: AIDifficulty[key]
      }))
    ]
  }

}
