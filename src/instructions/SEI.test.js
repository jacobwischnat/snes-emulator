const constants = require('../constants');
const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all SEI instructions', () => {
    it('Test SEI Instruction', () => {
        const memory = new Memory(8);
        const cpu = new CPU();

        memory.writeByte(CPU.Instruction.SEI, 0x00);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(cpu.flags & constants.FLAGS.I).toBeTruthy();
    });
});