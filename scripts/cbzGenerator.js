import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';
import { removeRecursive } from '../utils.js';

async function processFiles(inputPath, outputPath) {
  const files = await fs.readdir(inputPath);

  for (const directory of files) {
    const stats = await fs.lstat(path.join(inputPath, directory));
    if (stats.isDirectory()) {
      await processDirectory(path.join(inputPath, directory), outputPath);
      await removeRecursive(path.join(inputPath, directory));
    }
  }
}

async function processDirectory(inputPath, outputPath) {
  const issueOutputPath = `${path.join(outputPath, path.basename(inputPath))}.cbz`;
  const outputFile = new AdmZip();

  const files = (await fs.readdir(inputPath))
    .filter((file) => file.endsWith('.jpeg') || file.endsWith('.jpg') || file.endsWith('.png'))
    .map((file) => path.join(inputPath, file));

  for (const file of files) {
    outputFile.addFile(path.basename(file), await fs.readFile(file));
  }

  outputFile.writeZip(issueOutputPath);
}

export default processFiles;
