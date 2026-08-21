import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join, relative, resolve, sep } from "node:path";

const workspaceRoot = process.cwd();
const extensionDirectory = resolve(workspaceRoot, "dist/extension");
const packageJson = JSON.parse(await readFile(resolve(workspaceRoot, "package.json"), "utf8"));
const outputPath = resolve(workspaceRoot, `dist/web-audit-helper-extension-v${packageJson.version}.zip`);

const crcTable = Array.from({ length: 256 }, (_, index) => {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
        value = (value & 1) !== 0 ? (0xedb88320 ^ (value >>> 1)) : (value >>> 1);
    }
    return value >>> 0;
});

function crc32(buffer) {
    let crc = 0xffffffff;
    for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
}

async function listFiles(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
        const absolutePath = join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await listFiles(absolutePath));
        else if (entry.isFile()) files.push(absolutePath);
    }
    return files;
}

function localHeader(name, data, crc) {
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(0x0800, 6);
    header.writeUInt16LE(0, 8);
    header.writeUInt16LE(0, 10);
    header.writeUInt16LE(33, 12);
    header.writeUInt32LE(crc, 14);
    header.writeUInt32LE(data.length, 18);
    header.writeUInt32LE(data.length, 22);
    header.writeUInt16LE(name.length, 26);
    header.writeUInt16LE(0, 28);
    return header;
}

function centralHeader(name, data, crc, offset) {
    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(20, 6);
    header.writeUInt16LE(0x0800, 8);
    header.writeUInt16LE(0, 10);
    header.writeUInt16LE(0, 12);
    header.writeUInt16LE(33, 14);
    header.writeUInt32LE(crc, 16);
    header.writeUInt32LE(data.length, 20);
    header.writeUInt32LE(data.length, 24);
    header.writeUInt16LE(name.length, 28);
    header.writeUInt16LE(0, 30);
    header.writeUInt16LE(0, 32);
    header.writeUInt16LE(0, 34);
    header.writeUInt16LE(0, 36);
    header.writeUInt32LE(0, 38);
    header.writeUInt32LE(offset, 42);
    return header;
}

const localParts = [];
const centralParts = [];
let offset = 0;
const files = await listFiles(extensionDirectory);

for (const filePath of files) {
    const data = await readFile(filePath);
    const name = Buffer.from(relative(extensionDirectory, filePath).split(sep).join("/"), "utf8");
    const crc = crc32(data);
    const header = localHeader(name, data, crc);
    localParts.push(header, name, data);
    centralParts.push(centralHeader(name, data, crc, offset), name);
    offset += header.length + name.length + data.length;
}

const centralSize = centralParts.reduce((total, part) => total + part.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(0, 4);
end.writeUInt16LE(0, 6);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(centralSize, 12);
end.writeUInt32LE(offset, 16);
end.writeUInt16LE(0, 20);

await mkdir(resolve(workspaceRoot, "dist"), { recursive: true });
await writeFile(outputPath, Buffer.concat([...localParts, ...centralParts, end]));
console.log(`[WAH] Extension package created at ${relative(workspaceRoot, outputPath)}`);

