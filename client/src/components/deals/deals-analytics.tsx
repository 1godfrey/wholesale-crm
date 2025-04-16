import { Deal, DealStatus } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { formatCurrency } from "@/lib/utils/deal-utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

type DealsAnalyticsProps = {
  deals: Deal[];
};

export const DealsAnalytics = ({ deals }: DealsAnalyticsProps) => {
  // Calculate statistics
  const totalDeals = deals.length;
  const activeDeals = deals.filter(d => 
    d.status !== DealStatus.Closed && d.status !== DealStatus.Dead
  ).length;
  
  const closedDeals = deals.filter(d => d.status === DealStatus.Closed).length;
  const deadDeals = deals.filter(d => d.status === DealStatus.Dead).length;
  
  const avgDealValue = totalDeals > 0
    ? deals.reduce((sum, deal) => sum + (Number(deal.target_price) || 0), 0) / totalDeals
    : 0;
  
  const totalDealValue = deals.reduce(
    (sum, deal) => sum + (Number(deal.target_price) || 0), 0
  );
  
  // Create data for status distribution chart
  const statusCounts = Object.values(DealStatus).reduce((acc, status) => {
    const count = deals.filter(d => d.status === status).length;
    if (count > 0) {
      acc.push({ name: status, value: count });
    }
    return acc;
  }, [] as { name: string; value: number }[]);
  
  // Create data for monthly deal trends
  // For this example, we'll create simulated monthly data
  const currentMonth = new Date().getMonth();
  const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
    const month = new Date();
    month.setMonth(currentMonth - 5 + i);
    const monthName = month.toLocaleString('default', { month: 'short' });
    
    // Simulate some data - in a real app, this would come from actual deal data
    return {
      name: monthName,
      newDeals: Math.floor(Math.random() * 10) + 1,
      closedDeals: Math.floor(Math.random() * 8),
    };
  });
  
  // Data for property types
  const propertyTypes = [
    { name: 'Single Family', value: Math.floor(totalDeals * 0.6) },
    { name: 'Multi-Family', value: Math.floor(totalDeals * 0.15) },
    { name: 'Vacant Land', value: Math.floor(totalDeals * 0.15) },
    { name: 'Commercial', value: Math.ceil(totalDeals * 0.1) },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  return (
    <div className="space-y-6">
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Deals" 
          value={totalDeals}
          change={{ value: 8.3, isPositive: true }}
          subtitle="from last month"
        />
        <StatCard 
          title="Active Deals" 
          value={activeDeals}
          change={{ value: 5.2, isPositive: true }}
          subtitle="from last month"
        />
        <StatCard 
          title="Avg. Deal Value" 
          value={formatCurrency(avgDealValue)}
          change={{ value: 3.1, isPositive: true }}
          subtitle="from last month"
        />
        <StatCard 
          title="Success Rate" 
          value={`${totalDeals > 0 ? Math.round((closedDeals / totalDeals) * 100) : 0}%`}
          change={{ value: 2.5, isPositive: false }}
          subtitle="from last month"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deal Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusCounts}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} deals`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Property Types */}
        <Card>
          <CardHeader>
            <CardTitle>Property Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={propertyTypes}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Deals" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Deal Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyTrends}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="newDeals" name="New Deals" stroke="#8884d8" />
                <Line type="monotone" dataKey="closedDeals" name="Closed Deals" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Deal Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDealValue)}</div>
            <div className="text-xs text-neutral-500 mt-1">Lifetime deal value</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals > 0 ? ((closedDeals / totalDeals) * 100).toFixed(1) : 0}%</div>
            <div className="text-xs text-neutral-500 mt-1">Deals closed vs. total deals</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Loss Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals > 0 ? ((deadDeals / totalDeals) * 100).toFixed(1) : 0}%</div>
            <div className="text-xs text-neutral-500 mt-1">Deals lost vs. total deals</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};