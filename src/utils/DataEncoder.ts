import { encode as base45encode } from 'base45';

export interface DataEncoder {
    encode(data: ArrayBuffer): string
    encode(data: Uint8Array): string
}

export class SonicQrDataEncoder implements DataEncoder{
    
    DataEncoder() {}

    encode(data: Uint8Array): string {
        // return btoa(data.reduce((data, byte) => data + String.fromCharCode(byte), ''));
        return base45encode(data);
    }

    // encode(data: ArrayBuffer): string {
    //     return btoa(data.reduce((data, byte) => data + String.fromCharCode(byte), ''));
    // }
}
