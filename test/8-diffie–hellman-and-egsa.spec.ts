import {assert} from "chai";
import {generate_g, generate_prime_number, generate_random_number} from "../src/lib/rsa";
import {pow_mod} from "../src/lib/math";

describe('Diffie–Hellman and ElGamal encryption', function () {
    this.timeout(60_000);

    it('should key exchange by Diffie–Hellman protocol', async () => {
        // Alice round
        const [p, q] = [23, 5];
        const a = 6;

        const A = pow_mod(q, a, p);

        // Request message
        console.log('request message: ', {q, p, A});

        // Bob round
        const b = 15;
        const B = pow_mod(q, b, p);
        const K_Bob = pow_mod(A, b, p);

        // Response message
        console.log('response message: ', {B});

        // Alice second round
        const K_Alice = pow_mod(B, a, p);

        console.log('keys:', {K_Alice, K_Bob})

        assert.equal(K_Alice, K_Bob);
    });

    it('should key encrypt/decrypt by ElGamal encryption', async () => {
        // key generation
        const p = generate_prime_number(9, 100)
        const g = generate_g(p);
        const x = generate_random_number(2, p - 1); // secret key
        const y = pow_mod( g, x, p);

        console.log('public keys: ', { p, g, y });
        console.log('privet key: ', { x });

        // encrypt
        const M_in = 5;

        const k = generate_random_number(2, p - 1); // session key

        console.log('session key: ', { k })

        const a = pow_mod(g, k, p);
        const b = (Math.pow(y, k) * M_in) % p;

        console.log('cipher: ', { a, b })

        // decrypt
        const M_out = b *  Math.pow(  a, p - 1 - x) % p;

        console.log('messages:', {M_in, M_out})

        assert.equal(M_in, M_out);
    });

});


