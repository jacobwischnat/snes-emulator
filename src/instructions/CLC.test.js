const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test the CLC instruction', () => {
    it('Test the CLC instruction', () => {
        const memory = new Memory(8);
        const cpu = new CPU();

        memory.writeByte(CPU.Instruction.CLC, 0x00);

        cpu.flags = constants.FLAGS.C_CARRY;
        cpu.run(memory, 0x00, {breakAfterOne: true});
        expect(cpu.flags & constants.FLAGS.C_CARRY).toBeFalsy();
    });
});