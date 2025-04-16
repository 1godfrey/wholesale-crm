type StatCardProps = {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
};

export const StatCard = ({ title, value, change, subtitle }: StatCardProps) => {
  return (
    <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
      <p className="text-sm font-medium text-neutral-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
      
      {change && (
        <div className="mt-1 flex items-center text-sm">
          <div className={`${change.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            <i className={`${change.isPositive ? 'ri-arrow-up-line' : 'ri-arrow-down-line'} mr-1`}></i>
            <span>{Math.abs(change.value)}%</span>
          </div>
          {subtitle && <span className="text-neutral-500 ml-2">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
