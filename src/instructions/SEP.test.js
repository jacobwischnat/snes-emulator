const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all SEP instructions', () => {
    it('Test SEP Instruction', () => {
        const memory = new Memory(8);
        const cpu = new CPU();

        memory.writeByte(CPU.Instruction.SEP, 0x00);
        memory.writeByte(0x20, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});
        expect(cpu.flags & constants.FLAGS.M).toBeTruthy();
    });
});