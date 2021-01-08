console.clear();

const fs = require('fs');

const buffer = fs.readFileSync('Final Fantasy II (USA).sfc');

const Memory = require('./src/Memory');
const CPU = require('./src/CPU');
const ROM = require('./src/ROM');

const cpu = new CPU({debug: true});
const rom = new ROM();
const memory = new Memory(0xFFFF);
// const byte0 = buffer.readUInt8(0x7FFF + 1);
// const byte1 = buffer.readUInt8(0xFFFF + 1);


// const romInfo = rom.parseROMHeader(buffer.slice(0x7FBD));
// console.log(romInfo);

// // Do the HI-ROM, LO-ROM check here.

// console.log(byte0.toString(16), byte1.toString(16));

memory.loadProgram(buffer, 0);
cpu.run(memory, 0);


// setInterval(() => {}, 10000);