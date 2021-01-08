module.exports.FLAGS = {
    N_NEGATIVE: 0b10000000,
    V_OVERFLOW: 0b01000000,
    Z_ZERO: 0b00000010,
    C_CARRY: 0b00000001,  // Carry Flag
    D: 0b00001000,
    I: 0b00000100,  // Interrupt Disable Flag
    X: 0b00010000, // 0x10
    M: 0b00100000, // 0x20
    B: 0b00010000
}

module.exports.PAGE_SIZE = 0x100;

module.exports.INSTRUCTION = {
    ADC: 0x65,
    AND: 0x21,
    AND_DP: 0x32,
    BRA: 0x80,
    CLC: 0x18,
    LDA: 0xA9,
    LDA_Y: 0xB9,
    LDX: 0xA2,
    PHA: 0x48,
    PHB: 0x8B,
    PHD: 0x0B,
    PHK: 0x4B,
    PHX: 0xDA,
    PLB: 0xAB,
    PLD: 0x2B,
    PLX: 0xFA,
    JSR: 0x20,
    REP: 0xC2,
    SEI: 0x78,
    SEP: 0xE2,
    STA_A: 0x8D,
    STA_Y: 0x97,
    STY_A: 0x8C,
    STY_DP: 0x84,
    STY_DPX: 0x94,
    STZ_A: 0x9C,
    TAX: 0xAA,
    TXA: 0x8A,
    TXS: 0x9A,
    XBA: 0xEB,
    XCE: 0xFB,
}