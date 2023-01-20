import {binb_to_rstr, hex_encode, utf8_encode} from "./helpers";
import {rstr_to_binb} from "../helpers";

export function hex_sha1(s: string) {
    return hex_encode(rstr_sha1(utf8_encode(s)));
}

/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */
function binb_sha1(x: number[], len: number) {
    /* append padding */
    x[len >> 5] |= 0x80 << (24 - len % 32);
    x[((len + 64 >> 9) << 4) + 15] = len;

    const w = Array(80);
    let a = 1732584193;
    let b = -271733879;
    let c = -1732584194;
    let d = 271733878;
    let e = -1009589776;

    for (let i = 0; i < x.length; i += 16) {
        let old_a = a;
        let old_b = b;
        let old_c = c;
        let old_d = d;
        let old_e = e;

        for (let j = 0; j < 80; j++) {
            if (j < 16) w[j] = x[i + j];
            else w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);

            const t = safe_add(safe_add(bit_rol(a, 5), ft(j, b, c, d)), safe_add(safe_add(e, w[j]), kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
        }

        a = safe_add(a, old_a);
        b = safe_add(b, old_b);
        c = safe_add(c, old_c);
        d = safe_add(d, old_d);
        e = safe_add(e, old_e);
    }

    return [a, b, c, d, e];
}

/*
 * Perform the appropriate triplet combination function for the current iteration
 */
function ft(t: number, b: number, c: number, d: number) {
    if (t < 20) return (b & c) | ((~b) & d);
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return (b & c) | (b & d) | (c & d);

    return b ^ c ^ d;
}

/*
 * Determine the appropriate additive constant for the current iteration
 */
function kt(t: number) {
    return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
        (t < 60) ? -1894007588 : -899497514;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 */
function safe_add(x: number, y: number) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function bit_rol(num: number, cnt: number) {
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * Calculate the SHA1 of a raw string
 */
export function rstr_sha1(s: string) {
    return binb_to_rstr(binb_sha1(rstr_to_binb(s), s.length * 8));
}
