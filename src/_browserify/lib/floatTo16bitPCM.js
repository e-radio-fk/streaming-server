const bufferFrom = require('buffer-from');

const floatTo16BitPCM = (input) => {
    var output = new DataView(new ArrayBuffer(input.length * 2)); // length is in bytes (8-bit), so *2 to get 16-bit length
    for (var i = 0; i < input.length; i++) {
        var multiplier = input[i] < 0 ? 0x8000 : 0x7fff; // 16-bit signed range is -32768 to 32767
        output.setInt16(i * 2, (input[i] * multiplier) | 0, true); // index, value ("| 0" = convert to 32-bit int, round towards 0), littleEndian.
    }
    return bufferFrom(output.buffer);
}

export default floatTo16BitPCM;