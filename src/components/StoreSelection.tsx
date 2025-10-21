import { X } from "lucide-react";
import { GroceryStore, groceryStores } from "@/types/shopping";

interface StoreSelectionProps {
  onSelectStore: (store: GroceryStore) => void;
  onClose: () => void;
}

export function StoreSelection({ onSelectStore, onClose }: StoreSelectionProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Shop Online</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Starred Section */}
      <div className="p-4">
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-4">STARRED</p>
        
        {/* Store List */}
        <div className="space-y-2">
          {groceryStores.map((store) => (
            <button
              key={store.id}
              onClick={() => onSelectStore(store)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-4">
                <img 
                  src={store.logo} 
                  alt={store.name}
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <span className="text-lg font-medium text-gray-900">{store.name}</span>
                {store.available && store.id === 'walmart' && (
                  <span className="text-yellow-500">⭐</span>
                )}
              </div>
              <svg 
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
