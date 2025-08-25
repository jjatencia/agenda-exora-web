interface Props {
  onPick: () => void;
}

export default function NoData({ onPick }: Props) {
  return (
    <div className="text-center p-8">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">📅</span>
        </div>
        <h3 className="font-heading text-lg font-semibold text-gray-800 mb-2">
          Sin citas programadas
        </h3>
        <p className="text-gray-600 mb-6">
          No hay citas programadas para este día. 
          <br />¡Un día perfecto para descansar!
        </p>
        <button 
          onClick={onPick} 
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg font-medium"
        >
          📅 Seleccionar otra fecha
        </button>
      </div>
    </div>
  );
}
