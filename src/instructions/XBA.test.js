const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all XBA instructions', () => {
    it('Test XBA Instruction', () => {
        const memory = new Memory(1);
        const cpu = new CPU();
        const value = 0xCCDD;
        const exchanged = 0xDDCC;

        cpu.A = value;

        memory.writeByte(CPU.Instruction.XBA, 0x00);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(cpu.A).toEqual(exchanged);
    });
});