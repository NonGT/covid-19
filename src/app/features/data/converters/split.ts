export default function split(value: unknown, parameters?: string[]): string[] {
  const splitter = !!parameters && parameters.length ? parameters[0] : '';
  return String(value).split(splitter).map((s) => s.trim());
}
