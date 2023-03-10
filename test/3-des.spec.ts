import {assert} from "chai";
import {bytes_to_str, str_to_bytes} from "../src/lib/helpers";
import {TextDecoder} from "util";

const desLib = require('../src/lib/des');

describe('DES', function () {
    it('should encrypt/decryption', function () {
        const input = 'Lorem Ip' // 64 bit
        assert.deepEqual(input.length, 8);

        const key = [0x13, 0x34, 0x57, 0x79, 0x9B, 0xBC, 0xDF, 0xF1];
        const enc = desLib.DES.create({
            type: 'encrypt',
            key
        });

        const out = new Uint8Array([...enc.update(str_to_bytes(input)), ...enc.final()]);

        const dec = desLib.DES.create({
            type: 'decrypt',
            key,
        });
        const decryptText = dec.update(out);

        const decoder = new TextDecoder();

        console.log('decode text:', decoder.decode(new Uint8Array(decryptText)))

        assert.equal(input, bytes_to_str(new Uint8Array(decryptText)));
    })
});
