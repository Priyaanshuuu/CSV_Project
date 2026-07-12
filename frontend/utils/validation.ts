export function isCSV(file: File) {
  return file.name.endsWith(".csv");
}

export function isFileSizeValid(file: File) {
  return file.size <= 10 * 1024 * 1024;
}