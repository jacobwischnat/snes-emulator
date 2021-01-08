module.exports = class Memory {
    constructor(size, options = {}) {
        this.memory = Array.from({length: size}).fill(options.fill || 0);
    }

    loadProgram(program, startAddress) {
        console.log(program.slice(0, 10).toString('hex'));
        for (let index = 0; index < program.length; index += 1) {
            this.memory[startAddress + index] = program.readUInt8(index);
        }
    }

    printData(addressStart, addressEnd) {
        const lineSize = 0x0F;
        const start = Math.floor(addressStart / lineSize) * lineSize;
        const end = Math.ceil(addressEnd / lineSize) * lineSize;

        let lineStr = ' '.repeat(9);
        for (let i = 0x00; i <= lineSize; i += 1) {
            lineStr += `${i.toString(16).toUpperCase().padStart(2, '0')} `;
        }

        console.log(lineStr);

        console.log('-'.repeat(56));

        for (let line = start; line < end; line += lineSize) {
            lineStr = `0x${line.toString(16).toUpperCase().padStart(4, '0')} | `;
            for (let i = 0x00; i <= lineSize; i += 1) {
                const address = line + i;

                if (address < addressStart) lineStr += '-- ';
                else {
                    const value = this.readByte(address);
                    lineStr += value.toString(16).toUpperCase().padStart(2, '0') + ' ';
                }
            }

            console.log(lineStr);
        }
    };

    readWord(address) {
        const value = this.memory[address] + (this.memory[address + 1] << 8);

        return value;
    }

    readByte(address) {
        const value = this.memory[address];

        return value;
    }

    writeByte(value, address) {
        this.memory[address] = value & 0xFF;
    }

    writeWord(value, address) {
        this.memory[address] = value & 0xFF;
        this.memory[address + 1] = value >> 8;
    }
}