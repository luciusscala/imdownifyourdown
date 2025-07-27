import { FlightData } from "@/lib/types/trip";
import { format, parseISO } from "date-fns";
import { Plane, Clock, MapPin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FlightTimelineProps {
  flights: FlightData[];
}

export function FlightTimeline({ flights }: FlightTimelineProps) {
  if (flights.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5" />
            Flights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Plane className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No flights added yet</p>
            <p className="text-sm">Add flight links to see your itinerary</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Flights ({flights.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {flights.map((flight, index) => (
            <div key={flight.id} className="relative">
              {/* Timeline connector */}
              {index < flights.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gray-200" />
              )}
              
              <div className="flex gap-4">
                {/* Timeline dot */}
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plane className="h-5 w-5 text-blue-600" />
                </div>

                {/* Flight content */}
                <div className="flex-1 space-y-4">
                  {/* Flight header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {flight.trip_type || "Flight"} Booking
                      </h3>
                      <p className="text-sm text-gray-600">
                        {flight.flight_segments.length} segment{flight.flight_segments.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      {flight.total_price ? (
                        <Badge variant="outline" className="text-sm">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {flight.total_price.toFixed(2)} {flight.currency}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-sm">
                          Price not available
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Flight segments */}
                  <div className="space-y-3">
                    {flight.flight_segments.map((segment) => (
                      <div key={segment.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">
                              {segment.airline} {segment.flight_number}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              Segment {segment.segment_index}
                            </Badge>
                          </div>
                          {segment.duration_minutes && (
                            <span className="text-xs text-gray-500">
                              {Math.floor(segment.duration_minutes / 60)}h {segment.duration_minutes % 60}m
                            </span>
                          )}
                        </div>

                        {/* Route */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="font-medium">{segment.departure_airport}</span>
                          </div>
                          <div className="flex-1 mx-4 border-t border-gray-300" />
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="font-medium">{segment.arrival_airport}</span>
                          </div>
                        </div>

                        {/* Times */}
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(parseISO(segment.departure_time), "MMM d, h:mm a")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {format(parseISO(segment.arrival_time), "MMM d, h:mm a")}
                            </span>
                          </div>
                        </div>

                        {/* Layover info */}
                        {segment.layover_minutes && segment.layover_minutes > 0 && (
                          <div className="mt-2 text-xs text-gray-500 bg-yellow-50 px-2 py-1 rounded">
                            Layover: {Math.floor(segment.layover_minutes / 60)}h {segment.layover_minutes % 60}m
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 