import { useState } from 'react';
import { ArrowLeft, Check, ChevronUp } from 'lucide-react';
import { ShoppingListItem, GroceryStore } from '@/types/shopping';

interface ShoppingGuideProps {
  items: ShoppingListItem[];
  store: GroceryStore;
  onComplete: () => void;
  onBack: () => void;
}

export function ShoppingGuide({ items, store, onComplete, onBack }: ShoppingGuideProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [showList, setShowList] = useState(false);
  
  const currentItem = items[currentIndex];
  const totalItems = items.length;
  const progress = (completedItems.size / totalItems) * 100;

  const handleGotIt = () => {
    setCompletedItems(prev => new Set([...prev, currentIndex]));

    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (currentIndex < totalItems - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    onBack();
  };

  const goToItem = (index: number) => {
    setCurrentIndex(index);
    setShowList(false);
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#047857] to-[#065f46] text-white px-5 py-6 pt-12">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-lg">
            ←
          </button>
          <h1 className="text-2xl font-bold">{store.name}</h1>
          <div className="w-10"></div>
        </div>

        <div className="bg-white/20 h-1.5 rounded-full overflow-hidden mb-2">
          <div className="bg-white h-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm opacity-90">Item {currentIndex + 1} of {totalItems}</p>
      </div>

      {/* Main Content - Placeholder for WebView */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Shopping Guide</h2>
            <p className="text-gray-600 mb-6">
              Ready to shop for: <strong className="text-[#047857]">{currentItem.name}</strong>
            </p>

            {/* Search URL for reference */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-mono break-all">
                <strong>Would search:</strong><br />
                {store.url}{currentItem.name}
              </p>
            </div>

            <p className="text-sm text-gray-500">
              WebView temporarily disabled.
              <br />
              Use "Got it" or "Skip" to continue shopping.
            </p>
          </div>
        </div>
      </div>

      {/* Shopping List Drawer */}
      {showList && (
        <div className="absolute inset-0 bg-black/30 z-40" onClick={() => setShowList(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Shopping List</h3>
                <button
                  onClick={() => setShowList(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200"
                >
                  <ChevronUp size={20} className="text-gray-600" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {completedItems.size} of {totalItems} items completed
              </p>
            </div>
            <div className="overflow-y-auto max-h-[50vh] p-4 space-y-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => goToItem(index)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    index === currentIndex
                      ? 'bg-green-50 border-2 border-[#047857]'
                      : completedItems.has(index)
                      ? 'bg-gray-50 border border-gray-200 opacity-60'
                      : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    completedItems.has(index)
                      ? 'bg-[#047857] text-white'
                      : index === currentIndex
                      ? 'bg-[#047857] text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {completedItems.has(index) ? (
                      <Check size={14} />
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${
                      completedItems.has(index) ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}>
                      {item.amount} {item.unit} {item.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div className="bg-white border-t border-gray-200 p-4">
        {/* Current item info */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Shopping for:</p>
            <p className="text-lg font-semibold text-gray-900">
              {currentItem.amount} {currentItem.unit} {currentItem.name}
            </p>
          </div>
          <button
            onClick={() => setShowList(true)}
            className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <p className="text-xs text-gray-500">Items</p>
            <p className="text-sm font-bold">{currentIndex + 1} / {totalItems}</p>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSkip}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Skip
          </button>
          <button
            onClick={handleGotIt}
            className="flex-1 py-3 bg-[#047857] text-white rounded-xl font-semibold hover:bg-[#065f46] transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <Check size={20} />
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
