import { encode as base45encode } from 'base45';

export interface DataEncoder {
  encode(file: File, encodingType: DataEncodingType): Promise<EncodedData>
}

export enum DataEncodingType {
  base45 = 'Base45',
  base64 = 'Base64',
}

export type EncodedData = {
  encodedData: string,
  digest: string,
}

export class SonicQrDataEncoder implements DataEncoder {
  encode(file: File, encodingType = DataEncodingType.base45): Promise<EncodedData> {

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
      reader.onload = async () => { 
        if (!(reader.result instanceof ArrayBuffer)) return;
        const digest = await this.hashAsync(reader.result);
        const encodedDataString = (encodingType === DataEncodingType.base45)
          ? base45encode(new Uint8Array(reader.result))
          : btoa(String.fromCharCode(...new Uint8Array(reader.result)));
        
        console.log('digest', digest);
        console.log('encodedDataString', encodedDataString);
        
        resolve({ encodedData: encodedDataString, digest });
      };
      reader.onerror = (error) => reject(error);
    });

  }

  private async hashAsync(data: ArrayBuffer | string) {
    let encodedString: ArrayBuffer = (data instanceof ArrayBuffer) ? data : new TextEncoder().encode(data);
    return crypto.subtle.digest('SHA-256', encodedString).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
      return hashHex;
    });
  }

}
