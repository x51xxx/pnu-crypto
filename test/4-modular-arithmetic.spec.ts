import {gcdex, inverse_element, inverse_element_2, phi} from "../src/lib/modular-arithmetic";
import {assert} from "chai";

describe('Modular Arithmetic', function () {
    it('iterative gcd', function () {
        const d = gcdex(612, 342);

        assert.equal(d, 18)
        console.log(`gcdex: ${d}`)
    })

    it('inverse_element', function () {
        const d = inverse_element(5, 18);

        assert.equal(d, 11)
        console.log(`inverse_element(5, 18) = ${d}`)
    })

    it('inverse_element_2', function () {
        const d = inverse_element_2(5, 18);

        assert.equal(d, 11)
        console.log(`inverse_element_2(5, 18) = ${d}`)

        assert.equal(inverse_element_2(3, 11), 4)
    })

    it('phi', function () {
        const f = phi( 18);

        assert.equal(f, 6)
        console.log(`phi(18) = ${f}`)

        const [p, q] = [17, 11];
        assert.equal(phi(p * q), phi(p) * phi(q))
    })
});