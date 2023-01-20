export type CipherType = 'encrypt' | 'decrypt';
export type BinaryLike = number[] | Uint8Array

export interface CipherOptions {
    type: CipherType;
    key: BinaryLike;
}
