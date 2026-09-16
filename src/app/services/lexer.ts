import { Injectable } from '@angular/core';
import { Token } from '../models/token';

@Injectable({
  providedIn: 'root'
})
export class Lexer {

  tokens: Token[] = [];

}