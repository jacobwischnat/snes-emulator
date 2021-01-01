module.exports = class Memory {
    constructor() {
        this.memory = Array.from({length: 0xFFFF}).fill(0);

        console.dir(this);
    }

    loadProgram(program, startAddress) {
        console.log(program.slice(0, 10).toString('hex'));
        for (let index = 0; index < program.length; index += 1) {
            this.memory[startAddress + index] = program.readUInt8(index);
        }
    }

    readWord(address) {
        const value = this.memory[address] + (this.memory[address + 1] << 8);

        return value;
    }

    readByte(address) {
        const value = this.memory[address];

        return value;
    }

    writeByte(value, address) {
        this.memory[address] = value;
    }

    writeWord(value, address) {
        this.memory[address] = value & 0xFF;
        this.memory[address + 1] = value >> 8;
    }
}