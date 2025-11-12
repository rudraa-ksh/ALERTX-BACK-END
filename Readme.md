# 🌐 ALERTX-BACK-END

## Overview  
**ALERTX-BACK-END** is the server-side engine of the **ALERTX** real-time disaster alert platform.  
It handles ingestion, processing, and distribution of disaster-event data (type, severity, location, temperature, wind speed, range etc.), enabling users to receive timely alerts based on geolocation and disaster type.

It provides secure & efficient RESTful APIs for the mobile/web client to consume.

## Features  
- Real-time disaster event ingestion and notification  
- Geo-based filtering: subscribe to alerts within a radius of user location  
- Multi-type disasters (earthquakes, cyclones, floods, wildfires etc)  
- Modular architecture: routes, controllers, services, models separated  
- REST API endpoints designed for easy integration with mobile/web clients  
- Built to integrate with NoSQL (e.g., Firestore) + geoqueries for proximity detection


## Tech Stack  
- **Runtime**: Node.js  
- **Framework**: Express.js  
- **Language**: JavaScript (ES6+)  
- **Database**: Firestore (or other geo-capable database)  
- **Additional Tools**: dotenv, nodemon, body-parser, etc  
- **Geoqueries**: Use Firestore’s geospatial querying (or alternatives if substituted)


## Getting Started  

### 1. Clone the Repository  
```
git clone https://github.com/rudraa-ksh/ALERTX-BACK-END.git
cd ALERTX-BACK-END
```

### 2. Install Dependencies
```
npm install
```

### 3. Environment Setup
```
FIREBASE_CONFIG = {serviceAccountDetails}
mockapi = "Link to API to fetch disaster data"
GEMINI_KEY="gemini key"
```

### 4. Run the Server
```
npm start
```

## API Documentation
https://documenter.getpostman.com/view/37637006/2sB3HqJdzQ