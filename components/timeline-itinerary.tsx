import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format, differenceInMinutes } from "date-fns";

export type FlightSegment = {
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time_utc: string;
  arrival_time_utc: string;
};

export type Lodging = {
  name: string;
  location: string;
  number_of_guests: number;
  check_in: string;
  check_out: string;
  home_link: string;
};

export type TimelineItineraryProps = {
  flights: FlightSegment[];
  lodging: Lodging;
};

function formatDateTime(dt: string) {
  return format(new Date(dt), "MMM d, h:mm a");
}

function formatDate(dt: string) {
  return format(new Date(dt), "MMM d");
}

function formatDuration(start: string, end: string) {
  const mins = differenceInMinutes(new Date(end), new Date(start));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
}

const FlightSegmentItem = ({
  segment,
}: {
  segment: FlightSegment;
}) => (
  <div className="flex flex-col gap-1">
    <div className="font-medium">
      {segment.airline} {segment.flight_number}
    </div>
    <div className="text-sm text-muted-foreground flex flex-col gap-0.5">
      <span>
        {segment.departure_airport} &rarr; {segment.arrival_airport}
      </span>
      <span>
        {formatDateTime(segment.departure_time_utc)} – {formatDateTime(segment.arrival_time_utc)}
      </span>
      <span>
        Duration: {formatDuration(segment.departure_time_utc, segment.arrival_time_utc)}
      </span>
    </div>
  </div>
);

const Layover = ({
  prevArrival,
  nextDeparture,
}: {
  prevArrival: string;
  nextDeparture: string;
}) => {
  const mins = differenceInMinutes(new Date(nextDeparture), new Date(prevArrival));
  if (mins <= 0) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return (
    <div className="flex items-center justify-center py-2">
      <Separator className="flex-1" />
      <span className="px-2 text-xs text-muted-foreground">
        Layover: {h}h {m}m
      </span>
      <Separator className="flex-1" />
    </div>
  );
};

const LodgingSummary = ({ lodging }: { lodging: Lodging }) => (
  <Card className="mt-4">
    <CardContent className="py-4">
      <div className="flex flex-col gap-1">
        <a
          href={lodging.home_link}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-2"
        >
          {lodging.name}
        </a>
        <div className="text-sm text-muted-foreground">{lodging.location}</div>
        <div className="text-sm">
          Check-in: {formatDate(lodging.check_in)} &nbsp;|&nbsp; Check-out: {formatDate(lodging.check_out)}
        </div>
        <div className="text-sm">Guests: {lodging.number_of_guests}</div>
      </div>
    </CardContent>
  </Card>
);

export function TimelineItinerary({ flights, lodging }: TimelineItineraryProps) {
  // Sort flights by departure time
  const sortedFlights = [...flights].sort(
    (a, b) => new Date(a.departure_time_utc).getTime() - new Date(b.departure_time_utc).getTime()
  );

  return (
    <Card>
      <CardContent className="py-6">
        <div className="flex flex-col gap-6">
          {sortedFlights.map((segment, idx) => (
            <div key={idx}>
              <FlightSegmentItem segment={segment} />
              {idx < sortedFlights.length - 1 && (
                <Layover
                  prevArrival={segment.arrival_time_utc}
                  nextDeparture={sortedFlights[idx + 1].departure_time_utc}
                />
              )}
              {idx < sortedFlights.length - 1 && <Separator />}
            </div>
          ))}
          <Separator className="my-2" />
          <LodgingSummary lodging={lodging} />
        </div>
      </CardContent>
    </Card>
  );
} 