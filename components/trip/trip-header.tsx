import { TripData } from "@/lib/types/trip";
import { format, parseISO } from "date-fns";
import { Calendar, User } from "lucide-react";

interface TripHeaderProps {
  trip: TripData;
  hostEmail?: string;
}

export function TripHeader({ trip, hostEmail }: TripHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Trip Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
        <p className="text-gray-600 mt-1">
          Created {format(parseISO(trip.created_at), "PPP")}
        </p>
      </div>

      {/* Trip Info */}
      <div className="flex flex-wrap gap-6 text-sm text-gray-600">
        {hostEmail && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Host: {hostEmail}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Trip ID: {trip.id.slice(0, 8)}...</span>
        </div>
      </div>
    </div>
  );
} 