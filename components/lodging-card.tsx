"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Calendar, Users, DollarSign, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { LodgingData } from "@/lib/types/trip";

interface LodgingCardProps {
  lodging: LodgingData[];
}

export function LodgingCard({ lodging }: LodgingCardProps) {
  if (lodging.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg shadow-black/10">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-[#606c38] flex items-center gap-2">
            <Home className="h-5 w-5" />
            Lodging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#606c38]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home className="h-8 w-8 text-[#606c38]" />
            </div>
            <h3 className="text-lg font-medium text-[#606c38] mb-2">
              No lodging added yet
            </h3>
            <p className="text-[#606c38]/70">
              Add accommodation details for your trip
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg shadow-black/10">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-[#606c38] flex items-center gap-2">
          <Home className="h-5 w-5" />
          Lodging ({lodging.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {lodging.map((item, index) => (
          <div
            key={item.id}
            className={`p-6 bg-white/50 rounded-lg border border-white/30 hover:bg-white/70 transition-colors ${
              index !== lodging.length - 1 ? "border-b border-white/40" : ""
            }`}
          >
            {/* Header with name and location */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-[#283618] mb-1">
                  {item.name}
                </h3>
                <p className="text-[#606c38]/80 flex items-center gap-1">
                  <Home className="h-4 w-4" />
                  {item.location}
                </p>
              </div>
              {item.link && (
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#606c38]/20 text-[#606c38] hover:bg-[#606c38] hover:text-white"
                  onClick={() => window.open(item.link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View
                </Button>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Check-in/Check-out */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-[#606c38]/70">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Dates</span>
                </div>
                <div className="text-sm text-[#283618]">
                  <div className="font-medium">
                    {format(new Date(item.check_in), 'MMM d')}–{format(new Date(item.check_out), 'd, yyyy')}
                  </div>
                </div>
              </div>

              {/* Nights */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-[#606c38]/70">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium">Duration</span>
                </div>
                <div className="text-sm text-[#283618]">
                  {item.number_of_nights} night{item.number_of_nights !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-[#606c38]/70">
                  <Users className="h-4 w-4" />
                  <span className="font-medium">Guests</span>
                </div>
                <div className="text-sm text-[#283618]">
                  {item.number_of_guests} guest{item.number_of_guests !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Cost */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-[#606c38]/70">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Total Cost</span>
                </div>
                <div className="text-sm font-semibold text-[#283618]">
                  {item.currency} {item.total_cost?.toLocaleString() || 'TBD'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 