"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users } from "lucide-react";
import { FlightData, LodgingData, ParticipantData } from "@/lib/types/trip";

interface CostBreakdownCardProps {
  flights: FlightData[];
  lodging: LodgingData[];
  participants: ParticipantData[];
}

export function CostBreakdownCard({ flights, lodging, participants }: CostBreakdownCardProps) {
  // Calculate total costs
  const flightsCost = flights.reduce((total, flight) => total + (flight.total_price || 0), 0);
  const lodgingCost = lodging.reduce((total, item) => total + (item.total_cost || 0), 0);
  const totalCost = flightsCost + lodgingCost;
  const perPersonCost = participants.length > 0 ? totalCost / participants.length : totalCost;

  // Use the first currency we find (assuming all costs are in the same currency)
  const currency = flights[0]?.currency || lodging[0]?.currency || 'USD';

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg shadow-black/10">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-[#606c38] flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Cost Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        {totalCost === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#606c38]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-[#606c38]" />
            </div>
            <h3 className="text-lg font-medium text-[#606c38] mb-2">
              No costs added yet
            </h3>
            <p className="text-[#606c38]/70">
              Add flight or lodging details to see costs
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Total Costs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Flights Total */}
              <div className="space-y-1.5">
                <div className="text-sm text-[#606c38]/70">Flights Total</div>
                <div className="text-lg font-medium text-[#283618]">
                  {currency} {flightsCost.toLocaleString()}
                </div>
              </div>

              {/* Lodging Total */}
              <div className="space-y-1.5">
                <div className="text-sm text-[#606c38]/70">Lodging Total</div>
                <div className="text-lg font-medium text-[#283618]">
                  {currency} {lodgingCost.toLocaleString()}
                </div>
              </div>

              {/* Per Person */}
              <div className="space-y-1.5">
                <div className="text-sm text-[#606c38]/70 flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Per Person
                </div>
                <div className="text-lg font-medium text-[#283618]">
                  {currency} {perPersonCost.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Total with Separator */}
            <div className="pt-4 border-t border-[#606c38]/10">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-[#606c38]">Total Trip Cost</div>
                <div className="text-xl font-semibold text-[#283618]">
                  {currency} {totalCost.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}