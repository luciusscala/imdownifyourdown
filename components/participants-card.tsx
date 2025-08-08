"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Crown } from "lucide-react";
import { ParticipantData, TripData } from "@/lib/types/trip";

interface ParticipantsCardProps {
  participants: ParticipantData[];
  trip: TripData;
}

export function ParticipantsCard({ participants, trip }: ParticipantsCardProps) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg shadow-black/10">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-[#606c38] flex items-center gap-2">
          <Users className="h-5 w-5" />
          Participants ({participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {participants.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-[#606c38]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-[#606c38]" />
            </div>
            <h3 className="text-lg font-medium text-[#606c38] mb-2">
              No participants yet
            </h3>
            <p className="text-[#606c38]/70">
              Invite friends to join your trip
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg border border-white/30 hover:bg-white/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 bg-[#606c38]/10 text-[#606c38]">
                    <span className="text-xs font-medium">
                      {participant.user.email.charAt(0).toUpperCase()}
                    </span>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-[#283618] flex items-center gap-2">
                      {participant.user.email}
                      {participant.user.id === trip.host_id && (
                        <Badge variant="secondary" className="bg-[#606c38]/10 text-[#606c38] text-xs">
                          <Crown className="h-3 w-3 mr-1" />
                          Host
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-[#606c38]/70">
                      Joined {new Date(participant.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}