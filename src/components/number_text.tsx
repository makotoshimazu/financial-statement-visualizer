export default function NumberText({ value }: { value: number }) {
  return (
    <span>{value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
  );
}
