import { ChevronDown, ChevronUp } from 'lucide-react';
import { ChangeEvent } from 'react';

interface ItemLimitProps {
  itemLimit: number;
  setItemLimit: (limit: number) => void;
  minLimit?: number;
  maxLimit?: number;
  step?: number;
  className?: string;
}

const ItemLimiter: React.FC<ItemLimitProps> = ({
  itemLimit,
  setItemLimit,
  minLimit = 5,
  maxLimit = 15,
  step = 1,
  className = ''
}) => {
  const incrementItems = () => {
    if (itemLimit < maxLimit) {
      setItemLimit(Math.min(itemLimit + step, maxLimit));
    }
  };

  const decrementItems = () => {
    if (itemLimit > minLimit) {
      setItemLimit(Math.max(itemLimit - step, minLimit));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      // Ensure value is between min and max
      const limitedValue = Math.min(Math.max(value, minLimit), maxLimit);
      setItemLimit(limitedValue);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-500">Show items:</span>
      <div className="flex items-center border rounded">
        <button
          onClick={decrementItems}
          className="px-2 py-1 text-gray-600 hover:bg-gray-100 border-r"
          disabled={itemLimit <= minLimit}
        >
          <ChevronDown size={16} />
        </button>

        <input
          type="number"
          min={minLimit}
          max={maxLimit}
          value={itemLimit}
          onChange={handleInputChange}
          className="w-12 text-center text-sm py-1 border-none focus:ring-0"
        />

        <button
          onClick={incrementItems}
          className="px-2 py-1 text-gray-600 hover:bg-gray-100 border-l"
          disabled={itemLimit >= maxLimit}
        >
          <ChevronUp size={16} />
        </button>
      </div>
    </div>
  );
};

export default ItemLimiter;
