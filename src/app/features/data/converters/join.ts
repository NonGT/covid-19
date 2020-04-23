export default function join(value: unknown, parameters?: string[]): string {
  const joiner = !!parameters && parameters.length ? parameters[0] : '';
  return (value as string[]).join(joiner);
}
