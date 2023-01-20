import * as assert from 'minimalistic-assert'

import * as utils from './util';
import {BinaryLike, CipherOptions, CipherType} from './types';

class DESState {
    tmp = new Array(2);
    keys = new Array(0);
}

const shiftTable = [
    1, 1, 2, 2, 2, 2, 2, 2,
    1, 2, 2, 2, 2, 2, 2, 1
];


export class DES {
    protected type?: CipherType;
    protected blockSize = 8;
    protected buffer = new Array(this.blockSize);
    protected bufferOff = 0;

    protected _desState: DESState;

    constructor(protected options: CipherOptions) {
        this.type = this.options.type;

        const state = new DESState();
        this._desState = state;

        this.deriveKeys(state, options.key);
    }

    static create(options: CipherOptions) {
        return new DES(options);
    }

    deriveKeys(state: DESState, key: BinaryLike) {
        state.keys = Array(16 * 2);

        assert.equal(key.length, this.blockSize, 'Invalid key length');

        let kL = utils.readUInt32BE(key, 0);
        let kR = utils.readUInt32BE(key, 4);

        utils.pc1(kL, kR, state.tmp, 0);
        kL = state.tmp[0];
        kR = state.tmp[1];
        for (let i = 0; i < state.keys.length; i += 2) {
            let shift = shiftTable[i >>> 1];

            kL = utils.r28shl(kL, shift);
            kR = utils.r28shl(kR, shift);

            utils.pc2(kL, kR, state.keys, i);
        }
    }

    protected _update(inp: BinaryLike, inOff: number, out: BinaryLike, outOff: number) {
        const state = this._desState;

        let l = utils.readUInt32BE(inp, inOff);
        let r = utils.readUInt32BE(inp, inOff + 4);

        // Initial Permutation
        utils.ip(l, r, state.tmp, 0);
        l = state.tmp[0];
        r = state.tmp[1];

        if (this.type === 'encrypt')
            this._encrypt(state, l, r, state.tmp, 0);
        else
            this._decrypt(state, l, r, state.tmp, 0);

        l = state.tmp[0];
        r = state.tmp[1];

        utils.writeUInt32BE(out, l, outOff);
        utils.writeUInt32BE(out, r, outOff + 4);
    }

    protected pad(buffer: BinaryLike, off: number) {
        let value = buffer.length - off;
        for (let i = off; i < buffer.length; i++)
            buffer[i] = value;

        return true;
    }

    protected unpad(buffer: BinaryLike) {
        let pad = buffer[buffer.length - 1];
        for (let i = buffer.length - pad; i < buffer.length; i++)
            assert.equal(buffer[i], pad);

        return buffer.slice(0, buffer.length - pad);
    }

    protected _encrypt(state: DESState, lStart: number, rStart: number, out: BinaryLike, off: number) {
        let l = lStart;
        let r = rStart;

        // Apply f() x16 times
        for (let i = 0; i < state.keys.length; i += 2) {
            let keyL = state.keys[i];
            let keyR = state.keys[i + 1];

            // f(r, k)
            utils.expand(r, state.tmp, 0);

            keyL ^= state.tmp[0];
            keyR ^= state.tmp[1];
            const s = utils.substitute(keyL, keyR);
            const f = utils.permute(s);

            let t = r;
            r = (l ^ f) >>> 0;
            l = t;
        }

        // Reverse Initial Permutation
        utils.rip(r, l, out, off);
    }

    protected _decrypt(state: DESState, lStart: number, rStart: number, out: BinaryLike, off: number) {
        let l = rStart;
        let r = lStart;

        // Apply f() x16 times
        for (let i = state.keys.length - 2; i >= 0; i -= 2) {
            let keyL = state.keys[i];
            let keyR = state.keys[i + 1];

            // f(r, k)
            utils.expand(l, state.tmp, 0);

            keyL ^= state.tmp[0];
            keyR ^= state.tmp[1];
            let s = utils.substitute(keyL, keyR);
            let f = utils.permute(s);

            let t = l;
            l = (r ^ f) >>> 0;
            r = t;
        }

        // Reverse Initial Permutation
        utils.rip(l, r, out, off);
    }


    update(data: BinaryLike): number[] {
        if (data.length === 0)
            return [];

        if (this.type === 'decrypt')
            return this.updateDecrypt(data);
        else
            return this.updateEncrypt(data);
    }

    protected _buffer(data: BinaryLike, off: number) {
        // Append data to buffer
        const min = Math.min(this.buffer.length - this.bufferOff, data.length - off);
        for (let i = 0; i < min; i++)
            this.buffer[this.bufferOff + i] = data[off + i];
        this.bufferOff += min;

        // Shift next
        return min;
    }

    protected flushBuffer(out: BinaryLike, off: number) {
        this._update(this.buffer, 0, out, off);
        this.bufferOff = 0;
        return this.blockSize;
    }

    protected updateEncrypt(data: BinaryLike) {
        let inputOff = 0;
        let outputOff = 0;

        const count = ((this.bufferOff + data.length) / this.blockSize) | 0;
        const out = new Array(count * this.blockSize);

        if (this.bufferOff !== 0) {
            inputOff += this._buffer(data, inputOff);

            if (this.bufferOff === this.buffer.length)
                outputOff += this.flushBuffer(out, outputOff);
        }

        // Write blocks
        const max = data.length - ((data.length - inputOff) % this.blockSize);
        for (; inputOff < max; inputOff += this.blockSize) {
            this._update(data, inputOff, out, outputOff);
            outputOff += this.blockSize;
        }

        // Queue rest
        for (; inputOff < data.length; inputOff++, this.bufferOff++)
            this.buffer[this.bufferOff] = data[inputOff];

        return out;
    }

    protected updateDecrypt(data: BinaryLike) {
        let inputOff = 0;
        let outputOff = 0;

        let count = Math.ceil((this.bufferOff + data.length) / this.blockSize) - 1;
        const out = new Array(count * this.blockSize);

        for (; count > 0; count--) {
            inputOff += this._buffer(data, inputOff);
            outputOff += this.flushBuffer(out, outputOff);
        }

        // Buffer rest of the input
        inputOff += this._buffer(data, inputOff);

        return out;
    }

    final(buffer?: BinaryLike) {
        let first: number[] = [];
        if (buffer)
            first = this.update(buffer);

        let last;
        if (this.type === 'encrypt')
            last = this.finalEncrypt();
        else
            last = this.finalDecrypt();

        if (first)
            return new Array([...first, ...last]);
        else
            return last;
    }

    protected finalEncrypt(): number[] {
        if (!this.pad(this.buffer, this.bufferOff))
            return [];

        const out = new Array(this.blockSize);
        this._update(this.buffer, 0, out, 0);
        return out;
    }

    protected finalDecrypt() {
        assert.equal(this.bufferOff, this.blockSize, 'Not enough data to decrypt');

        const out = new Array(this.blockSize);
        this.flushBuffer(out, 0);

        return this.unpad(out);
    }

}
