export function mul02(a: number){
    const highBit = a & 0x80;
    // a * x, x = {02}, is equal to shift left. & with 0xff to cut overflows
    const shift = (a << 1) & 0xff;

    // If first bit is not 0 (a & 0x80 == 0), result is shift - m, where m = 0x011b, or m = x**8 + x**4 + x**3 + x + 1
    return highBit === 0 ? shift : shift ^ 0x1b
}

export function mul03(a: number) {
    return mul02(a) ^ a;
}

export function gmul02(a: number, b: number) {
    let p = 0;
    let highBit = 0;

    for (let i = 0; i < 8; i++) {
        if (b & 1) {
            p ^= a;
        }

        highBit = a & 0x80;
        a <<= 1;
        if (highBit) {
            a ^= 0x1b;
        }
        b >>= 1;
    }

    return p;
}