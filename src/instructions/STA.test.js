const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all STA instructions', () => {
    it('Test STA_A Instruction', () => {
        const memory = new Memory(0x2000, {fill: 0xFF});
        const cpu = new CPU();
        const address = 0x1E1E;
        const value = 0xCC;

        cpu.A = value;

        memory.writeByte(CPU.Instruction.STA_A, 0x00);
        memory.writeWord(address, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(memory.readByte(address)).toEqual(value);
    });
});