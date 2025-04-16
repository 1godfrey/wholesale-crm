import { Deal, DealStatus } from "@shared/schema";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarPlaceholder } from "@/components/ui/avatar-placeholder";
import { formatCurrency, formatDate } from "@/lib/utils/deal-utils";
import { getStatusColor } from "@/lib/utils/status-colors";

type DealsListViewProps = {
  deals: Deal[];
  loading: boolean;
  onDealClick: (deal: Deal) => void;
};

export const DealsListView = ({ deals, loading, onDealClick }: DealsListViewProps) => {
  const getStatusBadgeClass = (status: DealStatus) => {
    const { badgeColor } = getStatusColor(status);
    return badgeColor;
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Property</TableHead>
            <TableHead>Seller</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                Loading deals...
              </TableCell>
            </TableRow>
          ) : deals.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No deals found
              </TableCell>
            </TableRow>
          ) : (
            deals.map((deal) => (
              <TableRow 
                key={deal.deal_id} 
                className="hover:bg-neutral-50 cursor-pointer"
                onClick={() => onDealClick(deal)}
              >
                <TableCell>
                  <div className="font-medium">{deal.property_address}</div>
                  <div className="text-sm text-neutral-500">
                    {deal.bedrooms} bed, {deal.bathrooms} bath, {deal.square_footage} sqft
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <AvatarPlaceholder name={deal.seller_name} size="sm" />
                    <div>
                      <div>{deal.seller_name}</div>
                      <div className="text-sm text-neutral-500">{deal.seller_phone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {formatCurrency(deal.target_price)}
                </TableCell>
                <TableCell>
                  <Badge 
                    className={getStatusBadgeClass(deal.status as DealStatus)}
                    variant="outline"
                  >
                    {deal.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(deal.created_at ? deal.created_at.toString() : null)}</TableCell>
                <TableCell>{formatDate(deal.updated_at ? deal.updated_at.toString() : null)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle document action
                      }}
                    >
                      <i className="ri-file-list-line"></i>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle edit action
                      }}
                    >
                      <i className="ri-pencil-line"></i>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle more options
                      }}
                    >
                      <i className="ri-more-2-fill"></i>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};