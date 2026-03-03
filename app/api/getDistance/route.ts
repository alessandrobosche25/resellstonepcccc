import { NextRequest, NextResponse } from "next/server"; // Correct import for app directory

export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body from the request
    const { origins, destinations } = await req.json();

    // Validate that both origins and destinations are present
    if (!origins || !destinations) {
      return NextResponse.json({ error: "Origins and destinations are required" }, { status: 400 });
    }

    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // Make sure this is correctly set in your environment

    // Encode the origins and destinations
    const originEncoded = encodeURIComponent(origins);
    const destinationEncoded = encodeURIComponent(destinations);

    // Construct the Google Maps API URL
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originEncoded}&destinations=${destinationEncoded}&key=${GOOGLE_MAPS_API_KEY}`;

    // Fetch the distance data from Google Maps API
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data); // Send back the response data

  } catch (error) {
    console.error("Error fetching distance data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
