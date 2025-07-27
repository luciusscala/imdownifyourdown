// Shared types for trip-related data
export interface TripData {
  id: string;
  title: string;
  host_id: string;
  created_at: string;
}

export interface FlightSegmentData {
  id: string;
  flight_id: string;
  segment_index: number;
  airline: string;
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  duration_minutes: number;
  layover_minutes: number;
}

export interface FlightData {
  id: string;
  trip_id: string;
  total_price: number | null;
  currency: string;
  created_at: string;
  link: string;
  trip_type: string;
  flight_segments: FlightSegmentData[];
}

export interface LodgingData {
  id: string;
  trip_id: string;
  name: string;
  location: string;
  link: string;
  currency: string;
  number_of_guests: number;
  number_of_nights: number;
  check_in: string;
  check_out: string;
  total_cost: number | null;
  created_at: string;
}

export interface ParticipantData {
  id: string;
  trip_id: string;
  user_id: string;
  created_at: string;
  user: {
    id: string;
    email: string;
  };
}

export interface TripResponse {
  trip: TripData;
  flights: FlightData[];
  lodging: LodgingData[];
  participants: ParticipantData[];
  costBreakdown: {
    flights: number;
    lodging: number;
    total: number;
  };
} 