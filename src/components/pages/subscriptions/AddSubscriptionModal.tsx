interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export function AddSubscriptionModal({ isOpen, onClose, onAdd }: AddSubscriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="border border-border rounded-lg p-6 max-w-md w-full mx-4 bg-white">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Dodaj subskrypcję</h3>
        <p className="text-secondary mb-4">Formularz dodawania subskrypcji będzie tutaj...</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-black px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Anuluj
          </button>
          <button
            onClick={onAdd}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
}
