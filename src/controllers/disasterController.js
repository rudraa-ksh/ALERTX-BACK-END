let output_array =[];

export function disasters(req, res){

    const locations = [
        { id: "1", disasterType: "Earthquake", severityLevel: "High", rangeInKm: 150, latitude: 28.613939, longitude: 77.209023, location: "Delhi" },
        { id: "2", disasterType: "Flood", severityLevel: "Moderate", rangeInKm: 80, latitude: 19.076090, longitude: 72.877426, location: "Mumbai" },
        { id: "3", disasterType: "Cyclone", severityLevel: "Low", rangeInKm: 60, latitude: 13.082680, longitude: 80.270721, location: "Chennai" },
        { id: "4", disasterType: "Fire", severityLevel: "High", rangeInKm: 15, latitude: 22.572645, longitude: 88.363892, location: "Kolkata" },
        { id: "5", disasterType: "Earthquake", severityLevel: "Moderate", rangeInKm: 90, latitude: 12.971599, longitude: 77.594566, location: "Bengaluru" },
        { id: "6", disasterType: "Flood", severityLevel: "Low", rangeInKm: 40, latitude: 17.385044, longitude: 78.486671, location: "Hyderabad" },
        { id: "7", disasterType: "Cyclone", severityLevel: "High", rangeInKm: 220, latitude: 18.520430, longitude: 73.856743, location: "Pune" },
        { id: "8", disasterType: "Fire", severityLevel: "Moderate", rangeInKm: 10, latitude: 23.022505, longitude: 72.571365, location: "Ahmedabad" },
        { id: "9", disasterType: "Earthquake", severityLevel: "Low", rangeInKm: 65, latitude: 26.912434, longitude: 75.787270, location: "Jaipur" },
        { id: "10", disasterType: "Flood", severityLevel: "High", rangeInKm: 120, latitude: 26.846695, longitude: 80.946167, location: "Lucknow" },
        { id: "11", disasterType: "Cyclone", severityLevel: "Moderate", rangeInKm: 100, latitude: 21.145800, longitude: 79.088158, location: "Nagpur" },
        { id: "12", disasterType: "Fire", severityLevel: "Low", rangeInKm: 5, latitude: 22.719568, longitude: 75.857727, location: "Indore" },
        { id: "13", disasterType: "Earthquake", severityLevel: "High", rangeInKm: 140, latitude: 23.259933, longitude: 77.412613, location: "Bhopal" },
        { id: "14", disasterType: "Flood", severityLevel: "Moderate", rangeInKm: 85, latitude: 17.686816, longitude: 83.218483, location: "Visakhapatnam" },
        { id: "15", disasterType: "Cyclone", severityLevel: "Low", rangeInKm: 70, latitude: 25.594095, longitude: 85.137566, location: "Patna" }
    ];

    const loc = locations[Math.floor(Math.random() * locations.length)];

    let result={
        id: loc.id,
        disaster: loc.disasterType,
        latitude: loc.latitude,
        longitude: loc.longitude,
        location: loc.location,
        range: loc.rangeInKm,
        severity: loc.severityLevel,
    };
    output_array.push(result);
    res.json(output_array);
}