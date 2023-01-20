import {TextDecoder} from "util";

export const decode = (str: string):string => Buffer.from(str, 'base64').toString('utf-8');
export const encode = (str: string):string => Buffer.from(str, 'utf-8').toString('base64');

export function str_to_bytes(str: string): Uint8Array {
    return new TextEncoder().encode(str);
}

export function bytes_to_str(bytes: Uint8Array): string {
    return new TextDecoder().decode(bytes);
}

/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */
export function rstr_to_binb(input: string) {
    var output = Array(input.length >> 2);
    for (let i = 0; i < output.length; i++)
        output[i] = 0;
    for (let i = 0; i < input.length * 8; i += 8)
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    return output;
}