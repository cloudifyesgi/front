import { Injectable } from '@angular/core';
import {environment} from '../../../../environments/environment';
import {constants} from './constants';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor() { }

  getConstant(key: string): string {
      return environment.api + constants[key];
  }
}
