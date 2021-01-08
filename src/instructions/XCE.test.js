const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all XCE instructions', () => {
    it('Test XCE Instruction', () => {
        const memory = new Memory(4);
        const cpu = new CPU();

        memory.writeByte(CPU.Instruction.XCE, 0x00);

        cpu.flags |= constants.FLAGS.C_CARRY;
        cpu.M = 0;

        cpu.run(memory, 0x00, {breakAfterOne: true});
        expect(cpu.flags & constants.FLAGS.C_CARRY).toBeFalsy();
        expect(cpu.M).toBeTruthy();
    });
});