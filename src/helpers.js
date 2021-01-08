module.exports.add8 = (a, b) => {
    let result = 0;
    let carry = false;
    for (let i = 0; i < 8; i += 1) {
        const aBit = (a >> i) & 0b1;
        const bBit = (b >> i) & 0b1;

        let sum = 0b0;
        if (carry && aBit && bBit) sum = 0b1;
        else if (carry && (aBit || bBit)) sum = 0b0;
        else if (aBit && bBit) carry = true;
        else if (aBit || bBit) sum = 0b1;

        result |= sum << i;
    }

    let negative = false, zero = false, overflow = false;
    if (result < 0) negative = true;
    if (result === 0) zero = true;
    if (result & 0x80) overflow = true;

    return {a, b, result, carry, negative, zero, overflow};
}

module.exports.add16 = (a, b) => {
    let result = 0;
    let carry = false;
    for (let i = 0; i < 16; i += 1) {
        const aBit = (a >> i) & 0b1;
        const bBit = (b >> i) & 0b1;

        let sum = 0b0;
        if (carry && aBit && bBit) {
            sum = 0b1;
            carry = true;
        } else if (carry && (aBit || bBit)) {
            sum = 0b0;
            carry = true;
        } else if (aBit && bBit) carry = true;
        else if (aBit || bBit) sum = 0b1;
        else carry = false;

        result |= sum << i;
    }

    let negative = false, zero = false, overflow = false;
    if (result < 0) negative = true;
    if (result === 0) zero = true;
    if (result & 0x80) overflow = true;

    return {a, b, result, carry, negative, zero, overflow};
}

module.exports.invert = (value, bytes = 1) => {
    let inverted = 0x00;
    for (let i = 0; i < (bytes * 8); i += 1) {
        if (!(value & (0x01 << i))) inverted |= (0x01 << i);
    }

    return inverted;
}

module.exports.hex = (number, size = 2) => isNaN(number) ? new Error('NaN') : number.toString(16).padStart(size, '0');
module.exports.bin = (number, bits = 8) => isNaN(number) ? new Error('NaN') : number.toString(2).padStart(bits, '0');
