const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all STZ instructions', () => {
    it('Test STZ_A Instruction', () => {
        const memory = new Memory(0x2000, {fill: 0xFF});
        const cpu = new CPU();

        memory.writeByte(CPU.Instruction.STZ_A, 0x00);
        memory.writeWord(0x1010, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(memory.readByte(0x1010)).toEqual(0x00);
    });
});