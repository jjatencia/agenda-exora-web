'use client';

interface Props {
  currentIndex: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
  onAddNew?: () => void;
}

export default function BottomNavigation({ 
  currentIndex, 
  totalItems, 
  onPrevious, 
  onNext, 
  onAddNew 
}: Props) {
  const handleAddNew = () => {
    if (onAddNew) {
      onAddNew();
    } else {
      alert('Funcionalidad para añadir nueva cita.');
    }
  };

  return (
    <nav className="bottom-nav">
      <button 
        id="prev-btn" 
        className="p-4 rounded-full bg-white/20 transition transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onPrevious}
        disabled={currentIndex <= 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      
      <div className="fab" onClick={handleAddNew}>
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#02145C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
      
      <button 
        id="next-btn" 
        className="p-4 rounded-full bg-white/20 transition transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onNext}
        disabled={currentIndex >= totalItems - 1}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </nav>
  );
}