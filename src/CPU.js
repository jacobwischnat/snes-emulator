const hex = (number, size = 2) => number.toString(16).padStart(size, '0');
const bin = (number, bits = 8) => number.toString(2).padStart(bits, '0');

const FLAGS = {
    N: 0b10000000,
    V: 0b01000000,
    Z: 0b00000010,
    C: 0b00000001,  // Carry Flag
    D: 0b00001000,
    I: 0b00000100,  // Interrupt Disable Flag
    X: 0b00010000,
    M: 0b00100000,
    B: 0b00010000
}

const invert = (value, bytes = 1) => {
    let inverted = 0x00;
    for (let i = 0; i < (bytes * 8); i += 1) {
        if (!(value & (0x01 << i))) inverted |= (0x01 << i);
    }

    return inverted;
}

const PAGE_SIZE = 0x100;

module.exports = class CPU {
    constructor() {
        this.PC = 0;
        this.SP = 0x1fff;
        this.A = 0;
        this.B = 0;

        // Can hold 16 bits when in emulation mode.
        this.X = 0;
        this.Y = 0;

        this.DBR = 0; // Data-Bank Register
        this.PBR = 0; // Page-Bank Register
        this.P = 0; // Program-Bank Register
        this.D = 0; // Direct-Page Register
        this.flags = 0;
        this.E = 0;

        this.frequency = 1;

        console.dir(this);
    }

    get C() {
        return this.A + (this.B << 8);
    }

    set C(value) {
        this.A = value & 0xFF;
        this.B = value >> 8;
    }

    static get Instruction() {
        return {
            ADC: 0x65,
            AND: 0x21,
            AND_DP: 0x32,
            CLC: 0x18,
            LDA: 0xA9,
            LDX: 0xA2,
            PHA: 0x48,
            PHB: 0x8B,
            PHD: 0x0B,
            PHK: 0x4B,
            PHX: 0xDA,
            PLB: 0xAB,
            PLD: 0x2B,
            PLX: 0xFA,
            JSR: 0x20,
            REP: 0xC2,
            SEI: 0x78,
            SEP: 0xE2,
            STA_A: 0x8D,
            STA_Y: 0x97,
            STZ: 0x9C,
            STY_ZPX: 0x94,
            TAX: 0xAA,
            TXA: 0x8A,
            TXS: 0x9A,
            XBA: 0xEB,
            XCE: 0xFB,
        };
    }

    waitToProcess(cost) {

    }

    debugInfo() {
        return `PC: ${hex(this.PC, 2)} A: ${this.A} SP: ${this.SP} FLAGS: ${bin(this.flags)}`;
    }

    run(memory, startAddress) {
        let cost = 0;

        console.log(`startAddress: ${startAddress}(${hex(startAddress)})`);

        this.PC = startAddress;

        while (true) {
            console.log(this.debugInfo());
            const instruction = memory.readByte(this.PC);
            console.log(`Processing instruction ${instruction.toString(16).padStart(2, '0')}`)
            this.PC += 1;

            switch (instruction) {
                case CPU.Instruction.ADC:
                    {
                        const page = memory.readByte(this.PC);
                        const address = page * PAGE_SIZE;
                        const value = memory.readWord(address);

                        const result = value + (this.C ? 1 : 0);

                        if (result < 0) this.flags |= FLAGS.N;
                        if (result === 0) this.flags |= FLAGS.Z;
                        if (result & 0x80) this.flags |= FLAGS.V;

                        this.A = result & 0xFF;

                        this.PC += 1;
                        cost += 3;
                    }
                    break;

                case CPU.Instruction.JSR:
                    {
                        const address = memory.readWord(this.PC);
                        this.PC = address;
                        cost += 6;
                    }
                    break;

                case CPU.Instruction.LDX:
                    {
                        const value = memory.readWord(this.PC);
                        this.X = value;

                        this.PC += 2;
                        cost += 2;
                    }
                    break;

                case CPU.Instruction.PHA:
                    {
                        memory.writeByte(this.A, this.SP);
                        this.SP += 1;
                        cost += 1;
                    }
                    break;

                case CPU.Instruction.PHB:
                    {
                        memory.writeByte(this.DBR, this.SP);
                        this.SP += 1;
                        cost += 1;
                    }
                    break;

                case CPU.Instruction.PHD:
                    {
                        memory.writeByte(this.D, this.SP);
                        this.SP += 1;
                        cost += 1;
                    }
                    break;

                case CPU.Instruction.PHK:
                    {
                        memory.writeByte(this.PBR, this.SP);
                        this.SP += 1;
                        cost += 3;
                    }
                    break;

                case CPU.Instruction.PHX:
                    {
                        memory.writeByte(this.X, this.SP);
                        this.SP += 1;
                        cost += 1;
                    }
                    break;

                case CPU.Instruction.PLB:
                    {
                        this.DBR = memory.readByte(--this.SP);
                        cost += 5;
                    }
                    break;

                case CPU.Instruction.PLD:
                    {
                        this.D = memory.readByte(--this.SP);
                        cost += 5;
                    }
                    break;

                case CPU.Instruction.PLX:
                    {
                        this.X = memory.readByte(--this.SP);
                        cost += 4;
                    }
                    break;

                case CPU.Instruction.AND:
                    {
                        const ab4 = bin(this.A);
                        const value = memory.readByte(this.PC);
                        this.A &= value;

                        this.PC += 1;
                        cost += 2;
                        console.log(`AND: Anding value: 0x${hex(value)} with A ${ab4}->${bin(this.A)}`);
                    }
                    break;

                case CPU.Instruction.AND_DP:
                    {
                        const value = memory.readByte(this.PC);
                        this.A &= value;

                        this.PC += 1;
                        cost += 5;
                    }
                    break;

                case CPU.Instruction.LDA:
                    {
                        const value = memory.readByte(this.PC);
                        this.A = value;
                        this.PC += 1;
                        cost += 2;
                        console.log(`LDA: Storing value: 0x${hex(value)} into A`);
                    }
                    break;

                case CPU.Instruction.SEP:
                    {
                        const mask = memory.readByte(this.PC);
                        this.flags |= mask;

                        this.PC += 1;
                        cost += 3;
                        console.log(`SEP: Setting Flag bits ${bin(mask)}`);
                    }
                    break;

                case CPU.Instruction.REP:
                    {
                        const mask = memory.readByte(this.PC);
                        const notmask = invert(mask);
                        this.flags = this.flags & notmask;

                        this.PC += 1;
                        cost += 3;
                        console.log(`REP: Setting Flag bits ${bin(notmask)}`);
                    }
                    break;

                case CPU.Instruction.XCE:
                    {
                        const carry = this.flags & FLAGS.C;
                        const emulation = this.E;
                        if (carry) {
                            this.E = 1;
                        } else {
                            this.E = 0;
                        }

                        if (emulation) {
                            this.flags |= FLAGS.C;
                        } else {
                            this.flags = this.flags & invert(FLAGS.C);
                        }

                        cost += 2;
                        console.log(`XCE: Exchanging carry flag ${carry ? 'Set' : 'Not Set'} with Emulation ${emulation ? 'Set' : 'Not Set'}`);
                    }
                    break;

                case CPU.Instruction.CLC:
                    {
                        this.flags &= invert(FLAGS.C);
                        cost += 2;
                        console.log(`CLC: Clearing the carry flag (${bin(invert(FLAGS.C))})`);
                    }
                    break;

                case CPU.Instruction.STA_A:
                    {
                        const address = memory.readWord(this.PC);
                        memory.writeByte(this.A, address);
                        this.PC += 2;
                        cost += 4;
                        console.log(`STA_A: Storing 0x${hex(this.A)} into Address: 0x${hex(address, 4)}`)
                    }
                    break;

                case CPU.Instruction.STA_Y:
                    {
                        const address = memory.readWord(this.PC);
                        memory.writeByte(this.Y, address);
                        this.PC += 1;
                        cost += 6;
                        console.log(`STA_Y: Storing 0x${hex(this.Y)} into Address: 0x${hex(address, 4)}`)
                    }
                    break;

                case CPU.Instruction.SEI:
                    {
                        this.flags |= FLAGS.I;
                        cost += 2;
                        console.log(`SEI: Setting interrupt allowed to disabled.`);
                    }
                    break;

                case CPU.Instruction.STZ:
                    {
                        const address = memory.readWord(this.PC);
                        memory.writeWord(0x0000, address);
                        this.PC += 2;
                        cost += 4;
                        console.log(`STZ: Setting address: 0x${hex(address, 4)} to 0x0000`);
                    }
                    break;

                case CPU.Instruction.STY_ZPX:
                    {
                        const address = memory.readByte(this.PC);
                        memory.writeByte(this.Y, address + this.X);
                        console.log(`STY_ZPX: Storing Y into Address: 0x${hex(address)} + X(${hex(this.X)})`)
                        this.PC += 1;
                        cost += 4;
                    }
                    break;

                case CPU.Instruction.XBA:
                    {
                        const ab4 = this.A;
                        const temp = this.B;
                        this.A = this.B;
                        this.B = temp;
                        cost += 3;
                        console.log(`XBA: Exchanging B register 0x${hex(temp)} with A register 0x${hex(ab4)}`);
                    }
                    break;

                case CPU.Instruction.TXA:
                    {
                        this.A = this.X;
                        cost += 2;
                    }
                    break;

                case CPU.Instruction.TXS:
                    {
                        this.P = this.X;
                        cost += 2;
                    }
                    break;

                default:
                    this.PC -= 1;
                    console.log(memory.memory.slice(this.PC, this.PC + 10).map(v => v.toString(16).padStart(2, '0')).join(''));
                    console.error(`^---------- Unknown instruction ${instruction.toString(16).padStart(2, '0')}`)
                    return;
            }

            console.log();

            // Wait for the "cost of compute" to be settled.
            // await this.waitToProcess(cost);
        }
    }
}