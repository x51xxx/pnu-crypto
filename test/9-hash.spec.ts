import {assert} from "chai";
import {hex_sha1} from "../src/lib/hash";

describe('Hashing', function () {
    it('should hash by sha1', function () {
        assert.equal(  hex_sha1("crypto"), '44a9713350e53858f058463d4bf7f1e542d9ca4b');
        assert.equal(  hex_sha1("111111111111"), '7ec8aa461c2c28be905e1dfb0be256a971aa6108');
        assert.equal(  hex_sha1("abc"), 'a9993e364706816aba3e25717850c26c9cd0d89d');
    })
});