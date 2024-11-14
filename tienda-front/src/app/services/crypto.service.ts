import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private secretKey: string = 'Pu3nt3M4g1c0';

  constructor() { }

  /**
   * @description
   * Encripta una cadena de texto utilizando AES.
   * 
   * @param {string} data - La cadena de texto a encriptar.
   * @return {string} - La cadena de texto encriptada.
   */
  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  /**
   * @description
   * Desencripta una cadena de texto encriptada utilizando AES.
   * 
   * @param {string} data - La cadena de texto encriptada a desencriptar.
   * @return {string} - La cadena de texto desencriptada.
   */
  decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
