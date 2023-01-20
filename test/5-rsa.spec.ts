import {assert} from "chai";
import {is_prime, generate_prime_number} from "../src/lib/rsa";
import {gcdex, inverse_element} from "../src/lib/modular-arithmetic";
import {pow_mod} from "../src/lib/math";

describe('RSA', function () {
    it('should Miller-Rabin Primality Test', function () {
        assert.isTrue(is_prime(61,120))
        assert.isFalse(is_prime(2047,50))
        assert.isFalse(is_prime(2047,2050))
    })

    it('should encrypt and decrypt with random key', async () => {
        const p = generate_prime_number(99, 9_999)
        const q = generate_prime_number(99, 9_999)

        console.log('keys: ', {p, q})

        assert.notEqual(p, q);

        const phi = (p - 1) * (q - 1);

        let e;
        for(e = 2; e <= phi - 1; e++){
            if(gcdex(e, phi) == 1){
                break;
            }
        }

        console.log('e:', e)

        const n = p * q;

        const d = inverse_element(e, phi) // secret key

        const M_in = 2525;

        // encrypt
        const cipher = pow_mod(M_in, e, n);

        console.log('cipher: ', cipher)

        // decrypt
        const M_out = pow_mod(cipher, d, n);

        console.log('messages:', {M_in, M_out})

        assert.equal(M_in, M_out);
    });

    it('should encrypt and decrypt', async () => {
        const [p, q] = [61, 53];

        const phi = (p - 1) * (q - 1);

        assert.notEqual(phi, 3233);

        const e = 17;

        const n = p * q;

        const d = inverse_element(e, phi) // secret key

        assert.notEqual(d, 413);

        const M_in = 2525;
        // encrypt
        const cipher = pow_mod(M_in, e, n);

        // decrypt
        const M_out = pow_mod(cipher, d, n);

        assert.equal(M_in, M_out);
    });

});


