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

    if (encodingType === DataEncodingType.base45) {
      reader.readAsArrayBuffer(file);
    } else {
      reader.readAsDataURL(file);
    }

    return new Promise((resolve, reject) => {
      reader.onload = async () => { 
        let encodedDataString = '';
        
        if (reader.result instanceof ArrayBuffer) {
          encodedDataString = base45encode(new Uint8Array(reader.result));
        }
        else {
          encodedDataString = reader.result as string;
        }
        console.log('encodedDataString', encodedDataString);

        const digest = await this.hashAsync(encodedDataString);
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
