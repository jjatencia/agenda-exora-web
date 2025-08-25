interface Props {
  onPick: () => void;
}

export default function NoData({ onPick }: Props) {
  return (
    <div className="text-center p-8">
      <p className="mb-4">No hay citas para este día.</p>
      <button onClick={onPick} className="text-primary underline">
        Cambiar fecha
      </button>
    </div>
  );
}
