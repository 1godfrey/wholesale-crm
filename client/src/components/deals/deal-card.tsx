import { Deal } from "@shared/schema";
import { formatCurrency, getTimeSince } from "@/lib/utils/deal-utils";

type DealCardProps = {
  deal: Deal;
  onClick: (deal: Deal) => void;
};

export const DealCard = ({ deal, onClick }: DealCardProps) => {
  return (
    <div 
      className="bg-white p-4 mb-2 rounded border border-neutral-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick(deal)}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-medium text-neutral-900">{deal.property_address}</h4>
        <span className="text-xs font-semibold bg-neutral-100 text-neutral-600 rounded-full px-2 py-0.5">
          {formatCurrency(Number(deal.target_price))}
        </span>
      </div>
      <p className="text-sm text-neutral-500 mt-1">
        {deal.bedrooms} bed, {deal.bathrooms} bath, {deal.square_footage} sqft
      </p>
      <div className="mt-3 flex justify-between items-center">
        <span className="text-xs text-neutral-500">{deal.seller_name}</span>
        <span className="text-xs text-neutral-500">Added {getTimeSince(deal.created_at)}</span>
      </div>
    </div>
  );
};
