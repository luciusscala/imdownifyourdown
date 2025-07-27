import { LodgingData } from "@/lib/types/trip";
import { format, parseISO } from "date-fns";
import { Home, MapPin, Calendar, Users, DollarSign, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LodgingDetailsProps {
  lodging: LodgingData[];
}

export function LodgingDetails({ lodging }: LodgingDetailsProps) {
  if (lodging.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Lodging
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Home className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No lodging added yet</p>
            <p className="text-sm">Add accommodation links to see your stays</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Lodging ({lodging.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {lodging.map((lodge) => (
            <div key={lodge.id} className="border rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {lodge.name}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{lodge.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  {lodge.total_cost ? (
                    <Badge variant="outline" className="text-sm">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {lodge.total_cost.toFixed(2)} {lodge.currency}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-sm">
                      Price not available
                    </Badge>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Dates */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Check-in</span>
                  </div>
                  <p className="text-gray-900">
                    {format(parseISO(lodge.check_in), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Check-out</span>
                  </div>
                  <p className="text-gray-900">
                    {format(parseISO(lodge.check_out), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{lodge.number_of_guests} guest{lodge.number_of_guests !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  <span>{lodge.number_of_nights} night{lodge.number_of_nights !== 1 ? 's' : ''}</span>
                </div>
                {lodge.total_cost && lodge.number_of_nights && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span>
                      {(lodge.total_cost / lodge.number_of_nights).toFixed(2)} per night
                    </span>
                  </div>
                )}
              </div>

              {/* Booking Link */}
              {lodge.link && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <a
                    href={lodge.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Booking
                  </a>
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 