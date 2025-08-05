import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Plus } from "lucide-react";
import Link from "next/link";

interface Trip {
  id: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  participantCount: number;
  status: 'upcoming' | 'active' | 'completed';
}

interface TripPreviewCardProps {
  trips: Trip[];
}

export function TripPreviewCard({ trips }: TripPreviewCardProps) {
  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming');
  const activeTrips = trips.filter(trip => trip.status === 'active');

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg shadow-black/10">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-medium text-[#606c38]">
            Your Trips
          </CardTitle>
          <Button
            asChild
            size="sm"
            className="bg-[#606c38] hover:bg-[#606c38]/90 text-white"
          >
            <Link href="/trips/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Trip
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {trips.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#606c38]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-[#606c38]" />
            </div>
            <h3 className="text-lg font-medium text-[#606c38] mb-2">
              No trips yet
            </h3>
            <p className="text-[#606c38]/70 mb-4">
              Start planning your next adventure with friends
            </p>
            <Button
              asChild
              className="bg-[#606c38] hover:bg-[#606c38]/90 text-white"
            >
              <Link href="/trips/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Trip
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTrips.slice(0, 3).map((trip) => (
              <div
                key={trip.id}
                className="flex items-center justify-between p-4 bg-white/50 rounded-lg border border-white/30 hover:bg-white/70 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-[#606c38]">{trip.title}</h4>
                    <Badge variant="secondary" className="bg-[#606c38]/10 text-[#606c38] text-xs">
                      Upcoming
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#606c38]/70">
                    {trip.location && trip.location !== "TBD" && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {trip.location}
                      </div>
                    )}
                    {trip.startDate && trip.startDate !== "TBD" && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {trip.startDate}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {trip.participantCount} people
                    </div>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-[#606c38]/20 text-[#606c38] hover:bg-[#606c38] hover:text-white"
                >
                  <Link href={`/trips/${trip.id}`}>
                    View
                  </Link>
                </Button>
              </div>
            ))}
            
            {upcomingTrips.length > 3 && (
              <div className="text-center pt-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-[#606c38] hover:bg-[#606c38]/10"
                >
                  <Link href="/trips">
                    View all {trips.length} trips
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 