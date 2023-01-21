import {AES} from "../src/lib/aes";
import {assert} from "chai";
import {str_to_bytes} from "../src/lib/helpers";

describe('AES', function() {
    it('should encrypt and decrypt', () => {
        const key = str_to_bytes('abcdefg123456611');
        const message = 'Input text message';

        const cipher = new AES(key).encString(message);

        console.log(`cipher: 0x${cipher}`);

        const aesDec = new AES(key).decString(cipher);

        console.log('decrypt text: ', aesDec);

        assert.equal(message, aesDec);
    })
});