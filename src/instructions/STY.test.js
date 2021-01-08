const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all STY instructions', () => {
    it('Test STY_DPX in 8 bit mode', () => {
        const OFFSET_X = 0x04;
        const OFFSET_M = 0x03;
        const PAGE_SIZE = 256;
        const DIRECT_PAGE = 0x01;
        const offset = (DIRECT_PAGE << 8) + OFFSET_X + OFFSET_M;
        const memory = new Memory(4 * PAGE_SIZE);
        const cpu = new CPU();
        const value = 0xF0;

        cpu.flags |= constants.FLAGS.M;
        cpu.Y = value;
        cpu.X = OFFSET_X;
        cpu.D = DIRECT_PAGE;
        memory.writeByte(CPU.Instruction.STY_DPX, 0x00);
        memory.writeByte(OFFSET_M, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(memory.readByte(offset)).toEqual(value);
    });

    it('Test STY_DP in 8 bit mode', () => {
        const PAGE_SIZE = 256;
        const DIRECT_PAGE = 0x01;
        const OFFSET_M = 0x03;
        const offset = (DIRECT_PAGE << 8) + OFFSET_M;
        const memory = new Memory(4 * PAGE_SIZE);
        const cpu = new CPU();
        const value = 0xF0;

        cpu.flags |= constants.FLAGS.M;
        cpu.Y = value;
        cpu.D = DIRECT_PAGE;
        memory.writeByte(CPU.Instruction.STY_DP, 0x00);
        memory.writeByte(OFFSET_M, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(memory.readByte(offset)).toEqual(value);
    });

    it('Test STY_A in 8 bit mode', () => {
        const memory = new Memory(0xFFFF);
        const cpu = new CPU();
        const address = 0xBEEF;
        const value = 0xFEFE;

        cpu.Y = value;
        cpu.flags |= constants.FLAGS.M;
        memory.writeByte(CPU.Instruction.STY_A, 0x00);
        memory.writeWord(address, 1);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(memory.readWord(address)).toEqual(value & 0xFF);
    });

    it('Test STY_DPX in 16 bit mode', () => {
        const OFFSET_X = 0x04;
        const OFFSET_M = 0x03;
        const DIRECT_PAGE = 0x01;
        const offset = (DIRECT_PAGE << 8) + (OFFSET_X + OFFSET_M);
        const memory = new Memory(0x010F);
        const cpu = new CPU();
        const value = 0x0102;

        cpu.Y = value;
        cpu.X = OFFSET_X;
        cpu.D = DIRECT_PAGE;
        memory.writeByte(CPU.Instruction.STY_DPX, 0x00);
        memory.writeByte(OFFSET_M, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(memory.readWord(offset)).toEqual(value);
    });

    it('Test STY_DP in 16 bit mode', () => {
        const OFFSET_M = 0x03;
        const PAGE_SIZE = 256;
        const DIRECT_PAGE = 0x01;
        const offset = (DIRECT_PAGE << 8) + OFFSET_M;
        const memory = new Memory(4 * PAGE_SIZE);
        const cpu = new CPU();
        const value = 0xFEFE;

        cpu.Y = value;
        cpu.D = DIRECT_PAGE;
        memory.writeByte(CPU.Instruction.STY_DP, 0x00);
        memory.writeByte(OFFSET_M, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(memory.readWord(offset)).toEqual(value);
    });

    it('Test STY_A in 16 bit mode', () => {
        const memory = new Memory(0xFFFF);
        const cpu = new CPU();
        const address = 0xBEEF;
        const value = 0xFEFE;

        cpu.Y = value;
        cpu.flags |= constants.FLAGS.M;
        memory.writeByte(CPU.Instruction.STY_A, 0x00);
        memory.writeWord(address, 1);

        cpu.run(memory, 0x00, {breakAfterOne: true});
    });
});