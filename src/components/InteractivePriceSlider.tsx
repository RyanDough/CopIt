import { useState, useRef } from 'react';

interface InteractivePriceSliderProps {
  minPrice: number;
  maxPrice: number;
  currentPrice: number;
}

export function InteractivePriceSlider({ minPrice, maxPrice, currentPrice }: InteractivePriceSliderProps) {
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const calculatePrice = (x: number) => {
    if (!sliderRef.current) return currentPrice;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return Math.round(minPrice + (maxPrice - minPrice) * percentage);
  };

  const calculatePosition = (price: number) => {
    return ((price - minPrice) / (maxPrice - minPrice)) * 100;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const price = calculatePrice(x);
    
    setHoveredPrice(price);
    setTooltipPosition(x);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setHoveredPrice(null);
  };

  const currentPosition = calculatePosition(currentPrice);

  return (
    <div className="relative">
      <div 
        ref={sliderRef}
        className="h-3 bg-gray-200 rounded-full overflow-hidden cursor-pointer relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Green opacity gradient background */}
        <div 
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(to right, rgba(143, 168, 118, 0.3), rgba(143, 168, 118, 0.6), rgba(143, 168, 118, 1))'
          }}
        />
        
        {/* Current price indicator */}
        <div 
          className="absolute top-0 w-1 h-3 bg-primary border border-white rounded-sm"
          style={{ left: `${currentPosition}%`, transform: 'translateX(-50%)' }}
        />
      </div>
      
      {/* Tooltip */}
      {showTooltip && hoveredPrice && (
        <div 
          className="absolute -top-10 transform -translate-x-1/2 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10"
          style={{ left: `${tooltipPosition}px` }}
        >
          ${hoveredPrice}
        </div>
      )}
      
      {/* Labels */}
      <div className="flex justify-center text-xs text-muted-foreground mt-1">
        <span>Fair Value: ${currentPrice}</span>
      </div>
    </div>
  );
}