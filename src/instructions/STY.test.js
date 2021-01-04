const Memory = require('../Memory');
const CPU = require('../CPU');

describe('Test all STY instructions', () => {
    it('Test STY_DPX - It should write data from Y to the offset at (256 * 3) page 3 + X (3)', () => {
        const PAGE_SIZE = 256;
        const PAGE = 0x03;
        const OFFSET = 0x04;
        const memory = new Memory(4 * PAGE_SIZE);
        const cpu = new CPU();
        const offset = (PAGE * PAGE_SIZE) + OFFSET;
        const value = 0xF0;

        cpu.X = OFFSET;
        cpu.Y = value;
        memory.writeByte(CPU.Instruction.STY_DPX, 0x00);
        memory.writeByte(PAGE, 0x01);

        cpu.run(memory, 0x00, {breakAfterOne: true});

        expect(memory.readByte(offset)).toEqual(value);
    });
});