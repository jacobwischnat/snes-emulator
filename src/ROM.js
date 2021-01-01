const ROM_REGISTRATION_DATA_OFFSET = 0x0081B0;

module.exports = class ROM {
    loadROM(rom) {

    }

    parseROMHeader(buffer) {
        let offset = 0;
        // const makerCode = buffer.readUInt16LE(offset); offset += 2;
        // const gameCode = buffer.slice(offset, offset + 4).toString(); offset += 4;
        // offset += 7;
        const expansionRAMSize = buffer.readUInt8(offset); offset += 1;
        const specialVersion = buffer.readUInt8(offset); offset += 1;
        const cartridgeType = buffer.readUInt8(offset); offset += 1;

        const romName = buffer.slice(offset, offset + 21).toString(); offset += 21;
        const mapMode = buffer.readUInt8(offset); offset += 1;
        const romType = buffer.readUInt8(offset); offset += 1;
        const romSize = buffer.readUInt8(offset); offset += 1;
        const sramSize = buffer.readUInt8(offset); offset += 1;
        const destinationCode = buffer.readUInt8(offset); offset += 1;
        offset += 1;
        const version = buffer.readUInt8(offset); offset += 1;
        const complementCheck = buffer.readUInt16BE(offset); offset += 2;
        const checksum = buffer.readUInt16BE(offset); offset += 30;

        const checksumValid = (checksum | complementCheck) === 0xFFFF;

        const resetVector = buffer.readUInt16LE(offset); offset += 2;

        return {
            // makerCode,
            // gameCode,
            expansionRAMSize,
            specialVersion,
            cartridgeType,
            romName,
            mapMode,
            romType,
            romSize,
            sramSize,
            destinationCode,
            version,
            complementCheck,
            checksum,
            checksumValid,
            resetVector
        }
    }
}