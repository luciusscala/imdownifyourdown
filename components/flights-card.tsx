"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Calendar, DollarSign, ExternalLink, ChevronDown, ChevronUp, Clock } from "lucide-react";
import { format } from "date-fns";
import { FlightData } from "@/lib/types/trip";

interface FlightsCardProps {
  flights: FlightData[];
}

export function FlightsCard({ flights }: FlightsCardProps) {
  const [expandedFlights, setExpandedFlights] = useState<Set<string>>(new Set());

  const toggleFlight = (flightId: string) => {
    const newExpanded = new Set(expandedFlights);
    if (newExpanded.has(flightId)) {
      newExpanded.delete(flightId);
    } else {
      newExpanded.add(flightId);
    }
    setExpandedFlights(newExpanded);
  };

  if (flights.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg shadow-black/10">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-[#606c38] flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#606c38]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plane className="h-8 w-8 text-[#606c38]" />
            </div>
            <h3 className="text-lg font-medium text-[#606c38] mb-2">
              No flights added yet
            </h3>
            <p className="text-[#606c38]/70">
              Add flight details for your trip
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
          <Plane className="h-5 w-5" />
          Flights ({flights.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {flights.map((flight, index) => (
          <div
            key={flight.id}
            className={`p-6 bg-white/50 rounded-lg border border-white/30 hover:bg-white/70 transition-colors ${
              index !== flights.length - 1 ? "border-b border-white/40" : ""
            }`}
          >
            {/* Flight Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-medium text-[#283618]">
                    Flight {flight.id.slice(0, 8)}
                  </h3>
                  <Badge variant="secondary" className="bg-[#606c38]/10 text-[#606c38] text-xs">
                    {flight.trip_type}
                  </Badge>
                </div>
                <p className="text-[#606c38]/80 flex items-center gap-1">
                  <Plane className="h-4 w-4" />
                  {flight.flight_segments.length} segment{flight.flight_segments.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {flight.link && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#606c38]/20 text-[#606c38] hover:bg-[#606c38] hover:text-white"
                    onClick={() => window.open(flight.link, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#606c38] hover:bg-[#606c38]/10"
                  onClick={() => toggleFlight(flight.id)}
                >
                  {expandedFlights.has(flight.id) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Flight Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Route */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-[#606c38]/70">
                  <Plane className="h-4 w-4" />
                  <span className="font-medium">Route</span>
                </div>
                <div className="text-sm text-[#283618] font-medium">
                  {flight.flight_segments[0]?.departure_airport} → {flight.flight_segments[flight.flight_segments.length - 1]?.arrival_airport}
                </div>
              </div>

              {/* Total Duration */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-[#606c38]/70">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Duration</span>
                </div>
                <div className="text-sm text-[#283618]">
                  {Math.round(flight.flight_segments.reduce((total: number, segment: any) => total + segment.duration_minutes, 0) / 60)}h
                </div>
              </div>

              {/* Cost */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-[#606c38]/70">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">Total Cost</span>
                </div>
                <div className="text-sm font-semibold text-[#283618]">
                  {flight.currency} {flight.total_price?.toLocaleString() || 'TBD'}
                </div>
              </div>
            </div>

            {/* Expandable Segments */}
            {expandedFlights.has(flight.id) && (
              <div className="mt-4 pt-4 border-t border-white/30">
                <h4 className="text-sm font-medium text-[#606c38] mb-3">Flight Segments</h4>
                <div className="space-y-3">
                  {flight.flight_segments.map((segment: any, segmentIndex: number) => (
                    <div
                      key={segment.id}
                      className="p-4 bg-white/30 rounded-lg border border-white/20"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#606c38] bg-[#606c38]/10 px-2 py-1 rounded">
                            Segment {segment.segment_index + 1}
                          </span>
                          <span className="text-sm font-medium text-[#283618]">
                            {segment.airline} {segment.flight_number}
                          </span>
                        </div>
                        <span className="text-sm text-[#606c38]/70">
                          {segment.duration_minutes}h
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Departure */}
                        <div className="space-y-1">
                          <div className="text-xs text-[#606c38]/70 font-medium">Departure</div>
                          <div className="text-sm text-[#283618] font-medium">
                            {segment.departure_airport}
                          </div>
                          <div className="text-sm text-[#606c38]/80">
                            {format(new Date(segment.departure_time), 'MMM d, h:mm a')}
                          </div>
                        </div>
                        
                        {/* Arrival */}
                        <div className="space-y-1">
                          <div className="text-xs text-[#606c38]/70 font-medium">Arrival</div>
                          <div className="text-sm text-[#283618] font-medium">
                            {segment.arrival_airport}
                          </div>
                          <div className="text-sm text-[#606c38]/80">
                            {format(new Date(segment.arrival_time), 'MMM d, h:mm a')}
                          </div>
                        </div>
                      </div>

                      {/* Layover */}
                      {segment.layover_minutes > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <div className="flex items-center gap-2 text-sm text-[#606c38]/70">
                            <Clock className="h-3 w-3" />
                            <span>Layover: {Math.round(segment.layover_minutes / 60)}h {segment.layover_minutes % 60}m</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
} 