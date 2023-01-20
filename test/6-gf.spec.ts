import {assert} from "chai";
import {mul02, mul03} from "../src/lib/gf";

describe('GF(2^8)', function () {
    it('should GF', function () {
        //  D4 * 02 = B3, BF * 03 = DA
        assert.equal(mul02(0xd4), 0xb3);
        assert.equal(mul03(0xbf), 0xda);

        // extra check
        assert.equal(mul02(0x3c), 0x78);
        assert.equal(mul02(0xbc), 0x63);
    })
});