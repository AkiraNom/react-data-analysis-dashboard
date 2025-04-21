const LegendBox = ({ color, label }: { color: string; label: string }) => (
    <div className="flex items-center gap-1">
      <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: color }} />
      <span className="text-gray-600">{label}</span>
    </div>
  );

export default LegendBox;
