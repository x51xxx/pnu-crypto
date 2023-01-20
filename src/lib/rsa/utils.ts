import {pow_mod} from "../math";

export function miller_rabin(d: number, n: number): number | boolean {
    // random number in [2..n-2]
    let a = 2 + Math.floor(Math.random() * (n - 2)) % (n - 4);

    // Quick pow
    // Compute a^d % n
    let x = pow_mod(a, d, n)

    if (x == 1 || x == n - 1) {
        return Math.pow(4, -a);
    }

    // (i) d does not reach n-1
    // (ii) (x^2) % n is not 1
    // (iii) (x^2) % n is not n-1
    while (d != n - 1) {
        x = (x * x) % n;
        d *= 2;

        if (x == 1) {
            return false;
        }

        if (x == n - 1) {
            return true;//Math.pow(4, -a);
        }

    }

    return false;  // Return composite
}

export function is_prime(n: number, k: number) {
    if (n <= 1 || n == 4) return false;
    if (n <= 3) return true;

    // Find r such that n = 2^d * r + 1 for some r >= 1
    let d = n - 1;
    while (d % 2 == 0) {
        d /= 2;
    }

    let probability: number | boolean = 0;
    for (let i = 0; i < k; i++) {
        probability = miller_rabin(d, n);
        if (!probability) {
            return false;
        }
    }

    // return probability;
    return true;
}

export function generate_random_number(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function generate_prime_number(min: number, max: number): number {
    while (true) {
        let g = generate_random_number(min, max);
        if (is_prime(g, 100)) {
            return g
        }
    }
}

export function is_primitive_root(g: number, p: number) {
    for (let i = 1; i < p - 1; i++) {
        if (pow_mod(g, i, p) === 1) {
            return false;
        }
    }

    return true;
}

export function generate_g(p: number): number {
    while (true) {
        let g = generate_random_number(2, p);
        if (is_primitive_root(g, p)) {
            return g
        }
    }
}