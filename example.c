    /**
     * returns every coordinate pair in between two coordinate pairs given the desired interval
     * @param interval
     * @param azimuth
     * @param start
     * @param end
     * @return
     */
    private static List<MockLocation> getLocations(int interval, double azimuth, MockLocation start, MockLocation end)
    {
        Console.WriteLine("getLocations: " +
                "\ninterval: " + interval +
                "\n azimuth: " + azimuth +
                "\n start: " + start.toString());

        double d = getPathLength(start, end);
        int dist = (int)d / interval;
        int coveredDist = interval;
        List<MockLocation> coords = new List<MockLocation>();
        MockLocation mock = new MockLocation(start.lat, start.lng);
        coords.Add(mock);
        for (int distance = 0; distance < dist; distance += interval)
        {
            MockLocation coord = getDestinationLatLng(start.lat, start.lng, azimuth, coveredDist);
            coveredDist += interval;
            coords.Add(coord);
        }
        coords.Add(new MockLocation(end.lat, end.lng));
        return coords;
    }

    public static double ToRadians(this double val)
    {
        return (Math.PI / 180) * val;
    }

    /**
     * calculates the distance between two lat, long coordinate pairs
     * @param start
     * @param end
     * @return
     */
    private static double getPathLength(MockLocation start, MockLocation end)
    {
        double lat1Rads = ToRadians(start.lat);
        double lat2Rads = ToRadians(end.lat);
        double deltaLat = ToRadians(end.lat - start.lat);
        double deltaLng = ToRadians(end.lng - start.lng);
        double a = Math.Sin(deltaLat / 2) * Math.Sin(deltaLat / 2) + Math.Cos(lat1Rads) * Math.Cos(lat2Rads) * Math.Sin(deltaLng / 2) * Math.Sin(deltaLng / 2);
        double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
        double d = RADIUS_OF_EARTH * c;
        return d;
    }

    /**
     * returns the lat an long of destination point given the start lat, long, aziuth, and distance
     * @param lat
     * @param lng
     * @param azimuth
     * @param distance
     * @return
     */
    private static MockLocation getDestinationLatLng(double lat, double lng, double azimuth, double distance)
    {
        double radiusKm = RADIUS_OF_EARTH / 1000; //Radius of the Earth in km
        double brng = ToRadians(azimuth); //Bearing is degrees converted to radians.
        double d = distance / 1000; //Distance m converted to km
        double lat1 = ToRadians(lat); //Current dd lat point converted to radians
        double lon1 = ToRadians(lng); //Current dd long point converted to radians
        double lat2 = Math.Asin(Math.Sin(lat1) * Math.Cos(d / radiusKm) + Math.Cos(lat1) * Math.Sin(d / radiusKm) * Math.Cos(brng));
        double lon2 = lon1 + Math.Atan2(Math.Sin(brng) * Math.Sin(d / radiusKm) * Math.Cos(lat1), Math.Cos(d / radiusKm) - Math.Sin(lat1) * Math.Sin(lat2));
        //convert back to degrees
        lat2 = ToDegrees(lat2);
        lon2 = ToDegrees(lon2);
        return new MockLocation(lat2, lon2);
    }

    /**
     * calculates the azimuth in degrees from start point to end point");
     double startLat = ToRadians(start.lat);
     * @param start
     * @param end
     * @return
     */
    private static double calculateBearing(MockLocation start, MockLocation end)
    {
        double startLat = ToRadians(start.lat);
        double startLong = ToRadians(start.lng);
        double endLat = ToRadians(end.lat);
        double endLong = ToRadians(end.lng);
        double dLong = endLong - startLong;
        double dPhi = Math.Log(Math.Tan((endLat / 2.0) + (Math.PI / 4.0)) / Math.Tan((startLat / 2.0) + (Math.PI / 4.0)));
        if (Math.Abs(dLong) > Math.PI)
        {
            if (dLong > 0.0)
            {
                dLong = -(2.0 * Math.PI - dLong);
            }
            else
            {
                dLong = (2.0 * Math.PI + dLong);
            }
        }
        double bearing = (ToDegrees(Math.Atan2(dLong, dPhi)) + 360.0) % 360.0;
        return bearing;
    }

    public static double ToDegrees(double radians)
    {
        double degrees = (180 / Math.PI) * radians;
        return (degrees);
    }

    public class MockLocation
    {
        public double lat;
        public double lng;
        public MockLocation(double lat, double lng)
        {
            this.lat = lat;
            this.lng = lng;
        }
        public string toString()
        {
            return (lat + "," + lng).ToString();
        }
    }


// MAIN

// point interval in meters
int interval = 2;
// direction of line in degrees
//start point
double lat1 = 28.6514975008004;
double lng1 = 77.2216437757015;
// end point
double lat2 = 28.6514763167883;
double lng2 = 77.2221480309963;
MockLocation start = new MockLocation(lat1, lng1);
MockLocation end = new MockLocation(lat2, lng2);
double azimuth = calculateBearing(start, end);
Console.WriteLine(azimuth);
List<MockLocation> coords = getLocations(interval, azimuth, start, end);
foreach (MockLocation mockLocation in coords)
{
    Console.WriteLine(mockLocation.lat + ", " + mockLocation.lng);
}