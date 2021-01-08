const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all REP instructions', () => {
    it('Test REP Instruction', () => {
        const memory = new Memory(8);
        const cpu = new CPU();

        memory.writeByte(CPU.Instruction.REP, 0x00);
        memory.writeByte(0x10, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});
        expect(cpu.flags & constants.FLAGS.M).toBeFalsy();
    });
});