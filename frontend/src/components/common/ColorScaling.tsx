const getColor = (value: number): string => {
    if (value > 100_000) return '#3b82f6';
    if (value >= 10_000) return '#91a9FA';
    if (value < 10_000) return '#E5E9FE';
    return '#ccece6';
  };

  export default getColor;
