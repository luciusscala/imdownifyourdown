import { DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CostBreakdownProps {
  flights: number;
  lodging: number;
  total: number;
  currency?: string;
}

export function CostBreakdown({ flights, lodging, total, currency = "USD" }: CostBreakdownProps) {
  const hasCosts = flights > 0 || lodging > 0;

  if (!hasCosts) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cost Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <DollarSign className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No cost data available</p>
            <p className="text-xs">Add flights and lodging to see costs</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Cost */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-green-800">Total Trip Cost</p>
                <p className="text-xs text-green-600">All expenses combined</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-900">
                  {currency} {total.toFixed(2)}
                </p>
                <Badge variant="outline" className="text-xs bg-green-100 border-green-300">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Total
                </Badge>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Flights</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {currency} {flights.toFixed(2)}
                </span>
                {total > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({((flights / total) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">Lodging</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-900">
                  {currency} {lodging.toFixed(2)}
                </span>
                {total > 0 && (
                  <span className="text-xs text-gray-500 ml-2">
                    ({((lodging / total) * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Cost per person estimate */}
          {total > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Estimated cost per person</p>
                <p className="text-lg font-semibold text-gray-900">
                  {currency} {total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  (assuming equal split)
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 