import { TimelineItinerary, FlightSegment, Lodging } from "@/components/timeline-itinerary";
import googleFlightsData from "@/test_data/googleflights_api_data.json";
import airbnbData from "@/test_data/airbnb_api_data.json";

function getFlightsFromGoogleFlightsData(): FlightSegment[] {
  // Use the first trip's segments
  const trip = googleFlightsData[0];
  return trip.segments.map((seg: any) => ({
    airline: seg.airline,
    flight_number: seg.flight_number,
    departure_airport: seg.departure_airport,
    arrival_airport: seg.arrival_airport,
    departure_time_utc: seg.departure_time_utc,
    arrival_time_utc: seg.arrival_time_utc,
  }));
}

function getLodgingFromAirbnbData(): Lodging {
  const lodging = airbnbData[0];
  return {
    name: lodging.name,
    location: lodging.location,
    number_of_guests: lodging.number_of_guests,
    check_in: lodging.check_in,
    check_out: lodging.check_out,
    home_link: lodging.home_link,
  };
}

export default function PlanPage() {
  const flights = getFlightsFromGoogleFlightsData();
  const lodging = getLodgingFromAirbnbData();

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Trip Itinerary</h1>
      <TimelineItinerary flights={flights} lodging={lodging} />
    </main>
  );
} 