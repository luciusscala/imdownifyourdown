import { ParticipantData, TripData } from "@/lib/types/trip";
import { format, parseISO } from "date-fns";
import { Users, User, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ParticipantListProps {
  participants: ParticipantData[];
  trip: TripData;
}

export function ParticipantList({ participants, trip }: ParticipantListProps) {
  if (participants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No participants yet</p>
            <p className="text-sm">Share this trip to invite others</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participants ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {participants.map((participant) => {
            const isHost = participant.user_id === trip.host_id;
            const email = participant.user.email;
            const initials = email
              .split('@')[0]
              .split('.')
              .map(name => name.charAt(0).toUpperCase())
              .join('')
              .slice(0, 2);

            return (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isHost 
                    ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">
                        {email}
                      </p>
                      {isHost && (
                        <Badge variant="default" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                          <Crown className="h-3 w-3 mr-1" />
                          Host
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <User className="h-3 w-3" />
                      <span>
                        Joined {format(parseISO(participant.created_at), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-gray-500">
                    {isHost ? 'Trip Organizer' : 'Participant'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {participants.length}
              </p>
              <p className="text-xs text-gray-500">Total Participants</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {participants.filter(p => p.user_id === trip.host_id).length}
              </p>
              <p className="text-xs text-gray-500">Hosts</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 