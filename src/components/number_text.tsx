export default function NumberText({ value }: { value: number }) {
  return <span>{value.toLocaleString()}</span>;
}
