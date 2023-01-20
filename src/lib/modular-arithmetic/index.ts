export function gcdex(a: number, b: number): number {
    while (b) {
        [a, b] = [b, a % b];
    }

    return a;
}

export function inverse_element(a: number, n: number) {
    a = (a % n + n) % n;

    if (!a || n < 2) {
        throw 'Incorrect input';
    }

    let b = n;
    let s: { a: number, b: number }[] = []

    // gcdex()
    while (b) {
        [a, b] = [b, a % b];

        s.push({a, b})
    }

    // gcdex(a, n) !== 1
    if (a !== 1) {
        throw 'Incorrect input';
    }

    let [x, y] = [1, 0];

    for (let i = s.length - 2; i >= 0; --i) {
        [x, y] = [y, x - y * Math.floor(s[i].a / s[i].b)];
    }

    return (y % n + n) % n;
}

export function inverse_element_2(a: number, n: number) {
    if (gcdex(a, n) != 1) {
        throw 'Incorrect input';
    }

    for (let x = 1; x < n; x++) {
        if (((a % n) * (x % n)) % n == 1) {
            return x;
        }
    }
}

export function phi(m: number) {
    let result = m;
    for (let i = 2; i * i <= m; ++i) {
        if (m % i == 0) {
            while (m % i == 0) {
                m /= i;
            }

            result -= result / i;
        }
    }

    if (m > 1) {
        result -= result / m;
    }

    return result;
}

