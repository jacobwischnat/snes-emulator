const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all LDA instructions', () => {
    it('Test LDA Instruction', () => {
        const memory = new Memory(0x2000, {fill: 0xFF});
        const cpu = new CPU();
        const value = 0xCC;

        memory.writeByte(CPU.Instruction.LDA, 0x00);
        memory.writeByte(value, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(cpu.A).toEqual(value);
    });
});