const constants = require('./constants');
const helpers = require('./helpers');

module.exports = class CPU {
    constructor(options = {}) {
        this.options = options;

        this.PC = 0;
        this.SP = 0x1fff;

        this.DBR = 0; // Data-Bank Register
        this.PBR = 0; // Page-Bank Register
        this.P = 0; // Program-Bank Register
        this.D = 0; // Direct-Page Register
        this.flags = 0;
        this.E = 0;

        this.registers = {A: 0, B: 0, C: 0, X: 0, Y: 0};

        this.frequency = 1;
    }

    get M() {
        if (this.flags & constants.FLAGS.M) return true;
        else return false;
    }

    get X() {
        return this.flags & constants.FLAGS.X
            ? this.registers.X & 0xFF
            : this.registers.X;
    }

    set X(value) {
        if (this.flags & constants.FLAGS.X) this.registers.X = value & 0xFF;
        else this.registers.X = value;
    }

    get Y() {
        return this.flags & constants.FLAGS.X
            ? this.registers.Y & 0xFF
            : this.registers.Y;
    }

    set Y(value) {
        if (this.flags & constants.FLAGS.X) this.registers.Y = value & 0xFF;
        else this.registers.Y = value;
    }

    get A() {
        return this.M
            ? this.registers.B
            : this.registers.B + (this.registers.C << 8);
    }

    set A(value) {
        this.registers.B = value & 0xFF;
        this.registers.C = (value >> 8) & 0xFF;
    }

    get C() {
        return this.registers.C;
    }

    set C(value) {
        this.registers.C = value;
    }

    get B() {
        return this.registers.B;
    }

    set B(value) {
        this.registers.B = value;
    }

    static get Instruction() {
        return constants.INSTRUCTION;
    }

    waitToProcess(cost) {

    }

    debugInfo() {
        return `PC: ${helpers.hex(this.PC, 2)} A: ${this.A} B: ${this.B} C: ${this.C} D: ${this.D} X: ${this.X} SP: ${this.SP} FLAGS: ${helpers.bin(this.flags)}`;
    }

    run(memory, startAddress, options = {}) {
        let cost = 0;

        if (this.options.debug) console.log(`startAddress: ${startAddress}(${helpers.hex(startAddress)})`);

        this.PC = startAddress;

        while (true) {
            if (this.options.debug) console.log(this.debugInfo());
            const instruction = memory.readByte(this.PC);
            if (this.options.debug) console.log(`Processing instruction ${instruction.toString(16).padStart(2, '0')}`)
            this.PC += 1;

            switch (instruction) {
                case CPU.Instruction.ADC:
                    {
                        const page = memory.readByte(this.PC);
                        const address = page * constants.PAGE_SIZE;
                        const value = this.M ? memory.readByte(address) : memory.readWord(address);
                        const {
                            zero,
                            carry,
                            result,
                            overflow,
                            negative,
                        } = (this.M ? helpers.add8 : helpers.add16)(this.A, value);

                        console.log('result', result);
                        this.A = result;
                        console.log('this.A', this.A);

                        if (zero) this.flags |= constants.FLAGS.Z_ZERO;
                        if (carry) this.flags |= constants.FLAGS.C_CARRY;
                        if (negative) this.flags |= constants.FLAGS.N_NEGATIVE;
                        if (overflow) this.flags |= constants.FLAGS.V_OVERFLOW;

                        this.PC += 1;
                        cost += 3;
                    }
                    break;

                    case CPU.Instruction.CLC:
                        {
                            this.flags &= helpers.invert(constants.FLAGS.C_CARRY);
                            cost += 2;
                            if (this.options.debug) console.log(`CLC: Clearing the carry flag (${helpers.bin(helpers.invert(constants.FLAGS.C))})`);
                        }
                        break;

                    case CPU.Instruction.LDA:
                        {
                            const value = memory.readByte(this.PC);
                            this.A = value;
                            this.PC += 1;
                            cost += 2;
                            if (this.options.debug) console.log(`LDA: Storing value: 0x${helpers.hex(value)} into A`);
                        }
                        break;

                    case CPU.Instruction.REP:
                        {
                            const mask = memory.readByte(this.PC);
                            const notmask = helpers.invert(mask);
                            this.flags = this.flags & notmask;

                            this.PC += 1;
                            cost += 3;
                            if (this.options.debug) console.log(`REP: Setting Flag bits ${helpers.bin(notmask)}`);
                        }
                        break;

                    case CPU.Instruction.SEI:
                        {
                            this.flags |= constants.FLAGS.I;
                            cost += 2;
                            if (this.options.debug) console.log(`SEI: Setting interrupt allowed to disabled.`);
                        }
                        break;

                    case CPU.Instruction.SEP:
                        {
                            const mask = memory.readByte(this.PC);
                            this.flags |= mask;

                            this.PC += 1;
                            cost += 3;
                            if (this.options.debug) console.log(`SEP: Setting Flag bits ${helpers.bin(mask)}`);
                        }
                        break;

                    case CPU.Instruction.STA_A:
                        {
                            const address = memory.readWord(this.PC);
                            memory.writeByte(this.A, address);
                            this.PC += 2;
                            cost += 4;
                            if (this.options.debug) console.log(`STA_A: Storing 0x${helpers.hex(this.A)} into Address: 0x${helpers.hex(address, 4)}`)
                        }
                        break;

                    case CPU.Instruction.STY_DP:
                        {
                            const offset = memory.readByte(this.PC);
                            const address = (this.D << 8) + offset;

                            if (this.M) memory.writeByte(this.Y, address);
                            else memory.writeWord(this.Y, address);

                            this.PC += 1;
                            cost += 3;
                        }
                        break;

                    case CPU.Instruction.STY_A:
                        {
                            const address = memory.readWord(this.PC);

                            if (this.M) memory.writeByte(this.Y, address);
                            else memory.writeWord(this.Y, address);

                            this.PC += 2;
                            cost += 4;
                        }
                        break;

                    case CPU.Instruction.STY_DPX: // Direct Page + X
                        {
                            const operand = memory.readByte(this.PC);
                            const offset = operand + this.X;
                            const address = (this.D << 8) + offset;

                            if (this.M) memory.writeByte(this.Y, address);
                            else memory.writeWord(this.Y, address);

                            if (this.options.debug) console.log(`STY_DPX: Storing Y into Address: 0x${helpers.hex(address)}`)
                            this.PC += 1;
                            cost += 4;
                        }
                        break;

                    case CPU.Instruction.STZ_A:
                        {
                            const address = memory.readWord(this.PC);
                            // TODO: Check if word or byte?
                            memory.writeByte(0x00, address);
                            this.PC += 2;
                            cost += 4;
                            if (this.options.debug) console.log(`STZ_A: Setting address: 0x${helpers.hex(address, 4)} to 0x0000`);
                        }
                        break;

                    case CPU.Instruction.XBA:
                        {
                            const ab4 = this.B;
                            this.B = this.C;
                            this.C = ab4;
                            cost += 3;
                            if (this.options.debug) console.log(`XBA: Exchanging B register 0x${helpers.hex(temp)} with A register 0x${helpers.hex(ab4)}`);
                        }
                        break;

                    case CPU.Instruction.XCE:
                        {
                            const carry = this.flags & constants.FLAGS.C_CARRY;
                            const emulation = this.M;
                            if (carry) {
                                this.flags |= constants.FLAGS.M;
                            } else {
                                this.flags &= helpers.invert(constants.FLAGS.M);
                            }

                            if (emulation) {
                                this.flags |= constants.FLAGS.C_CARRY;
                            } else {
                                this.flags = this.flags & helpers.invert(constants.FLAGS.C_CARRY);
                            }

                            cost += 2;
                            if (this.options.debug) console.log(`XCE: Exchanging carry flag ${carry ? 'Set' : 'Not Set'} with Emulation ${emulation ? 'Set' : 'Not Set'}`);
                        }
                        break;
/*
                case CPU.Instruction.BRA:
                    {
                        const offset = memory.readByte(this.PC);
                        this.PC += 1;

                        const address = this.PC + offset;
                        this.PC = address;
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
                        const ab4 = helpers.bin(this.A);
                        const value = memory.readByte(this.PC);
                        this.A &= value;

                        this.PC += 1;
                        cost += 2;
                        if (this.options.debug) console.log(`AND: Anding value: 0x${helpers.hex(value)} with A ${ab4}->${helpers.bin(this.A)}`);
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



                case CPU.Instruction.LDA_Y:
                    const offset = memory.readByte(this.PC);
                    const address = this.Y + offset;
                    const value = memory.readByte(address);
                    this.PC += 1;
                    cost += 4;
                    if (this.options.debug) console.log(`LDA: Storing value: 0x${helpers.hex(value)} from 0x${helpers.hex(address, 4)} into A`);
                    break;

                case CPU.Instruction.STA_Y:
                    {
                        const address = memory.readWord(this.PC);
                        memory.writeByte(this.Y, address);
                        this.PC += 1;
                        cost += 6;
                        if (this.options.debug) console.log(`STA_Y: Storing 0x${helpers.hex(this.Y)} into Address: 0x${helpers.hex(address, 4)}`)
                    }
                    break;

                case CPU.Instruction.STZ:
                    {
                        const address = memory.readWord(this.PC);
                        memory.writeWord(0x0000, address);
                        this.PC += 2;
                        cost += 4;
                        if (this.options.debug) console.log(`STZ: Setting address: 0x${helpers.hex(address, 4)} to 0x0000`);
                    }
                    break;

                case CPU.Instruction.TAX:
                    {
                        const X = this.A;

                        if (X < 0) this.flags |= constants.FLAGS.N_NEGATIVE;
                        if (X === 0) this.flags |= constants.FLAGS.Z;
                        if (X & 0x80) this.flags |= constants.FLAGS.V_OVERFLOW;

                        this.X = X & 0xFF;

                        cost += 2;
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
*/

                default:
                    this.PC -= 1;
                    if (this.options.debug) console.log(memory.memory.slice(this.PC, this.PC + 10).map(v => v.toString(16).padStart(2, '0')).join(''));
                    if (this.options.debug) console.error(`^---------- Unknown instruction ${instruction.toString(16).padStart(2, '0')}`)
                    return;
            }

            if (options.breakAfterOne) return;

            // Wait for the "cost of compute" to be settled.
            // await this.waitToProcess(cost);
        }
    }
}