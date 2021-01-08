const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all ADC instructions', () => {
    it('Test ADC in 8 bit mode with Carry', () => {
        const memory = new Memory(0xFFFF);
        const cpu = new CPU();

        const A = 0xFE;
        const B = 0x03;

        cpu.M = 1;
        cpu.A = A;

        memory.writeByte(CPU.Instruction.ADC, 0x00);
        memory.writeByte(B, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect((A + B) & 0xFF).toBe(0x01);
        expect(!!(cpu.flags & constants.FLAGS.C_CARRY)).toBeTruthy();
    });

    it('Test ADC in 8 bit mode without Carry', () => {
        const memory = new Memory(0xFFFF);
        const cpu = new CPU();

        const A = 0xEE;
        const B = 0x03;

        cpu.M = 1;
        cpu.A = A;

        memory.writeByte(CPU.Instruction.ADC, 0x00);
        memory.writeByte(B, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect((A + B) & 0xFF).toBe(A + B);
        expect(!(cpu.flags & constants.FLAGS.C_CARRY)).toBeFalsy();
    });

    it('Test ADC in 16 bit mode with Carry', () => {
        const memory = new Memory(0xFFFF);
        const cpu = new CPU();

        const A = 0xFFFE;
        const B = 0x0003;

        cpu.M = 0;
        cpu.A = A;

        memory.writeByte(CPU.Instruction.ADC, 0x00);
        memory.writeWord(B, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect((A + B) & 0xFFFF).toBe(0x01);
        expect(!!(cpu.flags & constants.FLAGS.C_CARRY)).toBeTruthy();
    });

    it('Test ADC in 16 bit mode without Carry', () => {
        const memory = new Memory(0xFFFF);
        const cpu = new CPU();

        const A = 0xEFFE;
        const B = 0x0003;

        cpu.M = 0;
        cpu.A = A;

        memory.writeByte(CPU.Instruction.ADC, 0x00);
        memory.writeWord(B, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect((A + B) & 0xFFFF).toBe(0xF001);
        expect(!(cpu.flags & constants.FLAGS.C_CARRY)).toBeFalsy();
    });
});