const mongoose = require('mongoose');
const Accident = require('./models/Accident');
const User = require('./models/User');

const seedData = async () => {
  try {
    const MONGODB_URI = 'mongodb://localhost:27017/road-safety-guard';

    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected.', MONGODB_URI);

    // Set timestamps to distribute data
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000));
    const fiveDaysAgo = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000));

    let user = await User.findOne({});
    if (!user) {
      console.log('No users found. Creating a generic user.');
      user = await User.create({
        username: 'mockreporter',
        email: 'mock@example.com',
        password: 'password123',
        role: 'user'
      });
    }

    const mockAccidents = [
      {
        title: 'Multi-car collision on Highway 101',
        location: 'Highway 101, Near Exit 45',
        coordinates: { latitude: 37.7749, longitude: -122.4194 },
        dateTime: new Date(now.getTime() - (1 * 60 * 60 * 1000)), // 1 hour ago
        severity: 'High',
        description: 'Three cars collided due to sudden braking in heavy traffic. Emergency services arrived promptly.',
        category: 'Overspeeding',
        casualties: { fatalities: 0, injuries: 2 },
        vehicles: [{ type: 'Car', damage: 'Severe' }, { type: 'Car', damage: 'Moderate' }, { type: 'Car', damage: 'Minor' }],
        weather: { condition: 'Clear', visibility: 10 },
        reportedBy: user._id,
        status: 'Under Investigation',
        isVerified: true
      },
      {
        title: 'Motorcycle slip in downtown rain',
        location: 'Downtown Main St. & 5th Ave',
        coordinates: { latitude: 34.0522, longitude: -118.2437 },
        dateTime: new Date(now.getTime() - (3 * 60 * 60 * 1000)), // 3 hours ago
        severity: 'Moderate',
        description: 'Motorcyclist slipped on wet leaves while turning the corner. Minor scratches.',
        category: 'Weather conditions',
        casualties: { fatalities: 0, injuries: 1 },
        vehicles: [{ type: 'Motorcycle', damage: 'Minor' }],
        weather: { condition: 'Rainy', visibility: 4 },
        reportedBy: user._id,
        status: 'Under Investigation',
        isVerified: false
      },
      {
        title: 'Cargo truck breakdown causing traffic tie-up',
        location: 'I-95 Northbound Marker 102',
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        dateTime: new Date(now.getTime() - (8 * 60 * 60 * 1000)), // 8 hours ago
        severity: 'Low',
        description: 'A cargo truck stalled in the middle lane causing significant delays.',
        category: 'Other',
        casualties: { fatalities: 0, injuries: 0 },
        vehicles: [{ type: 'Truck', damage: 'Minor' }],
        weather: { condition: 'Foggy', visibility: 2 },
        reportedBy: user._id,
        status: 'Reported',
        isVerified: true
      },
      {
        title: 'Severe cross-intersection hit-and-run',
        location: 'Oak Drive and Pine Lane',
        coordinates: { latitude: 47.6062, longitude: -122.3321 },
        dateTime: oneDayAgo,
        severity: 'Critical',
        description: 'A vehicle ran a red light and t-boned a civilian SUV. Suspect fled the scene.',
        category: 'Distracted driving',
        casualties: { fatalities: 1, injuries: 3 },
        vehicles: [{ type: 'Car', damage: 'Total' }, { type: 'Car', damage: 'Severe' }],
        weather: { condition: 'Clear', visibility: 10 },
        reportedBy: user._id,
        status: 'Resolved',
        isVerified: true
      },
      {
        title: 'Bicycle accident on campus',
        location: 'University Ave Campus Gate',
        coordinates: { latitude: 42.3601, longitude: -71.0589 },
        dateTime: oneDayAgo,
        severity: 'Low',
        description: 'A bicyclist collided with a pedestrian on the bike path.',
        category: 'Other',
        casualties: { fatalities: 0, injuries: 1 },
        vehicles: [{ type: 'Bicycle', damage: 'Minor' }],
        weather: { condition: 'Clear', visibility: 10 },
        reportedBy: user._id,
        status: 'Reported',
        isVerified: false
      },
      {
        title: 'Drunk driver crashes into streetlight',
        location: 'Maple Street & 1st Ave',
        coordinates: { latitude: 29.7604, longitude: -95.3698 },
        dateTime: new Date(now.getTime() - (28 * 60 * 60 * 1000)), // 28 hours ago
        severity: 'High',
        description: 'A speeding car swerved into a streetlight. The driver was apprehended by police.',
        category: 'Drunk driving',
        casualties: { fatalities: 0, injuries: 1 },
        vehicles: [{ type: 'Car', damage: 'Total' }],
        weather: { condition: 'Clear', visibility: 10 },
        reportedBy: user._id,
        status: 'Resolved',
        isVerified: true
      },
      {
        title: 'Bus collision with parked car',
        location: 'Market Street Depot',
        coordinates: { latitude: 33.4484, longitude: -112.0740 },
        dateTime: new Date(now.getTime() - (40 * 60 * 60 * 1000)),
        severity: 'Moderate',
        description: 'A city bus sideswiped a legally parked car during a tight turn.',
        category: 'Distracted driving',
        casualties: { fatalities: 0, injuries: 0 },
        vehicles: [{ type: 'Bus', damage: 'Minor' }, { type: 'Car', damage: 'Moderate' }],
        weather: { condition: 'Cloudy', visibility: 8 },
        reportedBy: user._id,
        status: 'Under Investigation',
        isVerified: true
      },
      {
        title: 'Delivery van rear-ended at stop light',
        location: 'Colorado Blvd & Orange Grove',
        coordinates: { latitude: 34.1478, longitude: -118.1445 },
        dateTime: threeDaysAgo,
        severity: 'Moderate',
        description: 'Delivery van was hit from behind by a distracted driver reading their phone.',
        category: 'Distracted driving',
        casualties: { fatalities: 0, injuries: 2 },
        vehicles: [{ type: 'Truck', damage: 'Moderate' }, { type: 'Car', damage: 'Severe' }],
        weather: { condition: 'Sunny', visibility: 10 },
        reportedBy: user._id,
        status: 'Resolved',
        isVerified: true
      },
      {
        title: 'Skid out on icy bridge',
        location: 'Northern Overpass',
        coordinates: { latitude: 44.9778, longitude: -93.2650 },
        dateTime: threeDaysAgo,
        severity: 'High',
        description: 'A pickup truck lost control on black ice and hit the side barriers.',
        category: 'Weather conditions',
        casualties: { fatalities: 0, injuries: 1 },
        vehicles: [{ type: 'Truck', damage: 'Severe' }],
        weather: { condition: 'Snowy', visibility: 3 },
        reportedBy: user._id,
        status: 'Resolved',
        isVerified: true
      },
      {
        title: 'Pedestrian struck at crosswalk',
        location: 'Broad St. & 12th',
        coordinates: { latitude: 39.9526, longitude: -75.1652 },
        dateTime: new Date(now.getTime() - (80 * 60 * 60 * 1000)),
        severity: 'Critical',
        description: 'A pedestrian was hit by a turning vehicle in the crosswalk. Ambulance arrived rapidly.',
        category: 'Distracted driving',
        casualties: { fatalities: 0, injuries: 1 },
        vehicles: [{ type: 'Car', damage: 'Minor' }],
        weather: { condition: 'Rainy', visibility: 6 },
        reportedBy: user._id,
        status: 'Under Investigation',
        isVerified: true
      },
      {
        title: 'Street racing incident',
        location: 'Industrial Park Road',
        coordinates: { latitude: 32.7157, longitude: -117.1611 },
        dateTime: new Date(now.getTime() - (90 * 60 * 60 * 1000)),
        severity: 'High',
        description: 'Two cars involved in illegal street racing collided. Both drivers sustained injuries.',
        category: 'Overspeeding',
        casualties: { fatalities: 0, injuries: 2 },
        vehicles: [{ type: 'Car', damage: 'Total' }, { type: 'Car', damage: 'Severe' }],
        weather: { condition: 'Clear', visibility: 10 },
        reportedBy: user._id,
        status: 'Resolved',
        isVerified: true
      },
      {
        title: 'Pothole blows out tire causing swerve',
        location: 'Route 66 Mile 42',
        coordinates: { latitude: 35.0844, longitude: -106.6504 },
        dateTime: new Date(now.getTime() - (4 * 24 * 60 * 60 * 1000)),
        severity: 'Low',
        description: 'Driver hit a deep pothole, blew a tire, and swerved onto the grass median.',
        category: 'Other',
        casualties: { fatalities: 0, injuries: 0 },
        vehicles: [{ type: 'Car', damage: 'Minor' }],
        weather: { condition: 'Clear', visibility: 10 },
        reportedBy: user._id,
        status: 'Reported',
        isVerified: false
      },
      {
        title: 'Multiple vehicle pile-up in fog',
        location: 'Coastal Highway 1',
        coordinates: { latitude: 36.6002, longitude: -121.8947 },
        dateTime: fiveDaysAgo,
        severity: 'Critical',
        description: 'Dense sea fog led to a 5-car pile up early in the morning.',
        category: 'Weather conditions',
        casualties: { fatalities: 1, injuries: 6 },
        vehicles: [{ type: 'Car', damage: 'Severe' }, { type: 'Truck', damage: 'Moderate' }, { type: 'Car', damage: 'Total' }, { type: 'Car', damage: 'Moderate' }, { type: 'Car', damage: 'Severe' }],
        weather: { condition: 'Foggy', visibility: 1 },
        reportedBy: user._id,
        status: 'Resolved',
        isVerified: true
      },
      {
        title: 'E-Scooter collision with opening car door',
        location: 'Main St parallel parking',
        coordinates: { latitude: 39.7392, longitude: -104.9903 },
        dateTime: fiveDaysAgo,
        severity: 'Moderate',
        description: 'Driver opened their door into the bike lane, striking an oncoming electric scooter.',
        category: 'Distracted driving',
        casualties: { fatalities: 0, injuries: 1 },
        vehicles: [{ type: 'Other', damage: 'Minor' }, { type: 'Car', damage: 'Minor' }],
        weather: { condition: 'Clear', visibility: 10 },
        reportedBy: user._id,
        status: 'Under Investigation',
        isVerified: true
      },
      {
        title: 'Truck loses load on curve',
        location: 'Mountain Pass Highway',
        coordinates: { latitude: 39.5501, longitude: -105.7821 },
        dateTime: new Date(now.getTime() - (130 * 60 * 60 * 1000)),
        severity: 'High',
        description: 'An unsecured load of timber fell from a flatbed truck on a sharp curve, blocking both lanes.',
        category: 'Other',
        casualties: { fatalities: 0, injuries: 0 },
        vehicles: [{ type: 'Truck', damage: 'Minor' }],
        weather: { condition: 'Clear', visibility: 10 },
        reportedBy: user._id,
        status: 'Resolved',
        isVerified: true
      }
    ];

    // Insert accidents
    await Accident.deleteMany({});
    for (const data of mockAccidents) {
      try {
        await new Accident(data).save();
      } catch (e) {
        console.log("Validation Failed:", e.message);
      }
    }
    console.log(`Successfully finished mock accident script!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedData();
