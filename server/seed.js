const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('./models/User');
const Accident = require('./models/Accident');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/road-safety-guard';

// Dummy users data
const dummyUsers = [
  {
    username: 'admin_user',
    email: 'admin@roadsafety.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
    profile: {
      firstName: 'John',
      lastName: 'Admin',
      phone: '+1-555-0101',
      department: 'Administration'
    }
  },
  {
    username: 'officer_smith',
    email: 'officer.smith@roadsafety.com',
    password: 'officer123',
    role: 'officer',
    isVerified: true,
    profile: {
      firstName: 'Sarah',
      lastName: 'Smith',
      phone: '+1-555-0102',
      department: 'Traffic Police'
    }
  },
  {
    username: 'officer_johnson',
    email: 'officer.johnson@roadsafety.com',
    password: 'officer123',
    role: 'officer',
    isVerified: true,
    profile: {
      firstName: 'Michael',
      lastName: 'Johnson',
      phone: '+1-555-0103',
      department: 'Traffic Police'
    }
  },
  {
    username: 'citizen_alice',
    email: 'alice.citizen@email.com',
    password: 'user123',
    role: 'user',
    isVerified: true,
    profile: {
      firstName: 'Alice',
      lastName: 'Williams',
      phone: '+1-555-0104',
      department: 'General Public'
    }
  },
  {
    username: 'citizen_bob',
    email: 'bob.citizen@email.com',
    password: 'user123',
    role: 'user',
    isVerified: true,
    profile: {
      firstName: 'Bob',
      lastName: 'Brown',
      phone: '+1-555-0105',
      department: 'General Public'
    }
  },
  {
    username: 'citizen_carol',
    email: 'carol.citizen@email.com',
    password: 'user123',
    role: 'user',
    isVerified: true,
    profile: {
      firstName: 'Carol',
      lastName: 'Davis',
      phone: '+1-555-0106',
      department: 'General Public'
    }
  },
  {
    username: 'citizen_david',
    email: 'david.citizen@email.com',
    password: 'user123',
    role: 'user',
    isVerified: true,
    profile: {
      firstName: 'David',
      lastName: 'Miller',
      phone: '+1-555-0107',
      department: 'General Public'
    }
  },
  {
    username: 'citizen_eva',
    email: 'eva.citizen@email.com',
    password: 'user123',
    role: 'user',
    isVerified: true,
    profile: {
      firstName: 'Eva',
      lastName: 'Wilson',
      phone: '+1-555-0108',
      department: 'General Public'
    }
  }
];

// Dummy accidents data
const dummyAccidents = [
  {
    title: 'Highway Collision on I-95',
    location: 'Interstate 95, Mile Marker 42, Virginia',
    coordinates: {
      latitude: 38.9072,
      longitude: -77.0369
    },
    dateTime: new Date('2024-01-15T14:30:00Z'),
    severity: 'High',
    description: 'Multi-vehicle collision involving 3 cars due to sudden braking in heavy traffic. One vehicle rear-ended another, causing a chain reaction.',
    category: 'Distracted driving',
    casualties: {
      fatalities: 0,
      injuries: 3
    },
    vehicles: [
      { type: 'Car', damage: 'Severe' },
      { type: 'Car', damage: 'Moderate' },
      { type: 'Car', damage: 'Minor' }
    ],
    weather: {
      condition: 'Clear',
      visibility: 10
    },
    status: 'Under Investigation',
    isVerified: true,
    emergencyServices: {
      police: true,
      ambulance: true,
      fire: false
    },
    witnesses: [
      {
        name: 'John Witness',
        contact: '+1-555-0201',
        statement: 'Saw the first car brake suddenly, causing the collision.'
      }
    ]
  },
  {
    title: 'Motorcycle Accident on Main Street',
    location: 'Main Street & 5th Avenue, Downtown',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    dateTime: new Date('2024-01-14T09:15:00Z'),
    severity: 'Critical',
    description: 'Motorcycle collided with a turning vehicle at intersection. Rider was not wearing helmet.',
    category: 'Overspeeding',
    casualties: {
      fatalities: 1,
      injuries: 0
    },
    vehicles: [
      { type: 'Motorcycle', damage: 'Total' },
      { type: 'Car', damage: 'Moderate' }
    ],
    weather: {
      condition: 'Rainy',
      visibility: 5
    },
    status: 'Resolved',
    isVerified: true,
    emergencyServices: {
      police: true,
      ambulance: true,
      fire: false
    },
    witnesses: [
      {
        name: 'Mary Observer',
        contact: '+1-555-0202',
        statement: 'The motorcycle was going very fast and ran the red light.'
      }
    ]
  },
  {
    title: 'Truck Rollover on Highway 101',
    location: 'Highway 101, Northbound, California',
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194
    },
    dateTime: new Date('2024-01-13T16:45:00Z'),
    severity: 'High',
    description: 'Large truck carrying construction materials rolled over on sharp curve. Driver lost control due to excessive speed.',
    category: 'Overspeeding',
    casualties: {
      fatalities: 0,
      injuries: 1
    },
    vehicles: [
      { type: 'Truck', damage: 'Total' }
    ],
    weather: {
      condition: 'Clear',
      visibility: 15
    },
    status: 'Under Investigation',
    isVerified: true,
    emergencyServices: {
      police: true,
      ambulance: true,
      fire: true
    },
    witnesses: [
      {
        name: 'Tom Driver',
        contact: '+1-555-0203',
        statement: 'The truck was going way too fast for that curve.'
      }
    ]
  },
  {
    title: 'Pedestrian Hit by Car',
    location: 'Oak Street & Elm Avenue, Residential Area',
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437
    },
    dateTime: new Date('2024-01-12T18:20:00Z'),
    severity: 'Moderate',
    description: 'Pedestrian was hit while crossing the street. Driver claims they did not see the pedestrian due to poor lighting.',
    category: 'Distracted driving',
    casualties: {
      fatalities: 0,
      injuries: 1
    },
    vehicles: [
      { type: 'Car', damage: 'Minor' }
    ],
    weather: {
      condition: 'Foggy',
      visibility: 3
    },
    status: 'Reported',
    isVerified: false,
    emergencyServices: {
      police: true,
      ambulance: true,
      fire: false
    },
    witnesses: [
      {
        name: 'Lisa Walker',
        contact: '+1-555-0204',
        statement: 'The pedestrian was in the crosswalk when hit.'
      }
    ]
  },
  {
    title: 'Drunk Driving Incident',
    location: 'Broadway & 42nd Street, Manhattan',
    coordinates: {
      latitude: 40.7589,
      longitude: -73.9851
    },
    dateTime: new Date('2024-01-11T23:30:00Z'),
    severity: 'High',
    description: 'Driver under influence of alcohol crashed into parked vehicles. Driver was arrested at scene.',
    category: 'Drunk driving',
    casualties: {
      fatalities: 0,
      injuries: 1
    },
    vehicles: [
      { type: 'Car', damage: 'Severe' },
      { type: 'Car', damage: 'Moderate' },
      { type: 'Car', damage: 'Minor' }
    ],
    weather: {
      condition: 'Clear',
      visibility: 8
    },
    status: 'Resolved',
    isVerified: true,
    emergencyServices: {
      police: true,
      ambulance: true,
      fire: false
    },
    witnesses: [
      {
        name: 'Officer Martinez',
        contact: '+1-555-0205',
        statement: 'Driver showed clear signs of intoxication and failed sobriety test.'
      }
    ]
  },
  {
    title: 'Weather-Related Multi-Car Pileup',
    location: 'Interstate 80, Westbound, Pennsylvania',
    coordinates: {
      latitude: 40.2732,
      longitude: -76.8754
    },
    dateTime: new Date('2024-01-10T11:00:00Z'),
    severity: 'Critical',
    description: 'Heavy snowfall caused multiple vehicles to lose control and collide. Chain reaction involving 8 vehicles.',
    category: 'Weather conditions',
    casualties: {
      fatalities: 2,
      injuries: 12
    },
    vehicles: [
      { type: 'Car', damage: 'Total' },
      { type: 'Car', damage: 'Severe' },
      { type: 'Truck', damage: 'Moderate' },
      { type: 'Car', damage: 'Severe' },
      { type: 'Car', damage: 'Moderate' },
      { type: 'Car', damage: 'Minor' },
      { type: 'Car', damage: 'Moderate' },
      { type: 'Car', damage: 'Minor' }
    ],
    weather: {
      condition: 'Snowy',
      visibility: 2
    },
    status: 'Closed',
    isVerified: true,
    emergencyServices: {
      police: true,
      ambulance: true,
      fire: true
    },
    witnesses: [
      {
        name: 'Emergency Responder',
        contact: '+1-555-0206',
        statement: 'Extreme weather conditions made rescue operations difficult.'
      }
    ]
  },
  {
    title: 'Bicycle Accident at Intersection',
    location: 'Park Avenue & 23rd Street, Midtown',
    coordinates: {
      latitude: 40.7406,
      longitude: -73.9857
    },
    dateTime: new Date('2024-01-09T07:45:00Z'),
    severity: 'Low',
    description: 'Cyclist was hit by a car making a right turn. Cyclist sustained minor injuries.',
    category: 'Distracted driving',
    casualties: {
      fatalities: 0,
      injuries: 1
    },
    vehicles: [
      { type: 'Bicycle', damage: 'Moderate' },
      { type: 'Car', damage: 'Minor' }
    ],
    weather: {
      condition: 'Clear',
      visibility: 10
    },
    status: 'Resolved',
    isVerified: true,
    emergencyServices: {
      police: true,
      ambulance: false,
      fire: false
    },
    witnesses: [
      {
        name: 'Bike Commuter',
        contact: '+1-555-0207',
        statement: 'The car turned without checking for cyclists in the bike lane.'
      }
    ]
  },
  {
    title: 'Bus Collision with Car',
    location: 'Main Street & University Avenue, College Town',
    coordinates: {
      latitude: 42.3601,
      longitude: -71.0589
    },
    dateTime: new Date('2024-01-08T15:20:00Z'),
    severity: 'Moderate',
    description: 'City bus collided with a car that ran a red light. Multiple passengers on bus were shaken but unharmed.',
    category: 'Distracted driving',
    casualties: {
      fatalities: 0,
      injuries: 2
    },
    vehicles: [
      { type: 'Bus', damage: 'Minor' },
      { type: 'Car', damage: 'Severe' }
    ],
    weather: {
      condition: 'Clear',
      visibility: 12
    },
    status: 'Under Investigation',
    isVerified: true,
    emergencyServices: {
      police: true,
      ambulance: true,
      fire: false
    },
    witnesses: [
      {
        name: 'Bus Passenger',
        contact: '+1-555-0208',
        statement: 'The car definitely ran the red light.'
      }
    ]
  },
  {
    title: 'Rush Hour Fender Bender',
    location: 'Highway 405, Southbound, Los Angeles',
    coordinates: {
      latitude: 34.0522,
      longitude: -118.2437
    },
    dateTime: new Date('2024-01-07T17:30:00Z'),
    severity: 'Low',
    description: 'Minor collision between two vehicles during heavy rush hour traffic. No injuries reported.',
    category: 'Distracted driving',
    casualties: {
      fatalities: 0,
      injuries: 0
    },
    vehicles: [
      { type: 'Car', damage: 'Minor' },
      { type: 'Car', damage: 'Minor' }
    ],
    weather: {
      condition: 'Clear',
      visibility: 8
    },
    status: 'Resolved',
    isVerified: true,
    emergencyServices: {
      police: true,
      ambulance: false,
      fire: false
    },
    witnesses: [
      {
        name: 'Traffic Cam',
        contact: 'N/A',
        statement: 'Incident captured on traffic camera footage.'
      }
    ]
  },
  {
    title: 'Construction Zone Accident',
    location: 'Route 66, Construction Zone, Arizona',
    coordinates: {
      latitude: 33.4484,
      longitude: -112.0740
    },
    dateTime: new Date('2024-01-06T10:15:00Z'),
    severity: 'Moderate',
    description: 'Vehicle struck construction equipment due to driver not noticing reduced speed limit signs.',
    category: 'Distracted driving',
    casualties: {
      fatalities: 0,
      injuries: 1
    },
    vehicles: [
      { type: 'Car', damage: 'Severe' }
    ],
    weather: {
      condition: 'Clear',
      visibility: 15
    },
    status: 'Reported',
    isVerified: false,
    emergencyServices: {
      police: true,
      ambulance: true,
      fire: false
    },
    witnesses: [
      {
        name: 'Construction Worker',
        contact: '+1-555-0209',
        statement: 'Driver was going too fast for the construction zone.'
      }
    ]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Accident.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of dummyUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`Created user: ${user.username}`);
    }

    // Create accidents with random users as reporters
    for (let i = 0; i < dummyAccidents.length; i++) {
      const accidentData = { ...dummyAccidents[i] };
      
      // Assign random user as reporter (prefer regular users)
      const regularUsers = createdUsers.filter(user => user.role === 'user');
      const randomUser = regularUsers[Math.floor(Math.random() * regularUsers.length)];
      accidentData.reportedBy = randomUser._id;

      // Assign verifier for verified accidents (use officers or admin)
      if (accidentData.isVerified) {
        const verifiers = createdUsers.filter(user => user.role === 'officer' || user.role === 'admin');
        const randomVerifier = verifiers[Math.floor(Math.random() * verifiers.length)];
        accidentData.verifiedBy = randomVerifier._id;
        accidentData.verifiedAt = new Date(accidentData.dateTime.getTime() + Math.random() * 24 * 60 * 60 * 1000); // Random time within 24 hours
      }

      const accident = new Accident(accidentData);
      await accident.save();
      console.log(`Created accident: ${accident.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`Created ${createdUsers.length} users and ${dummyAccidents.length} accidents`);
    
    // Display summary
    console.log('\n📊 Summary:');
    console.log(`- Admin users: ${createdUsers.filter(u => u.role === 'admin').length}`);
    console.log(`- Officer users: ${createdUsers.filter(u => u.role === 'officer').length}`);
    console.log(`- Regular users: ${createdUsers.filter(u => u.role === 'user').length}`);
    
    const accidents = await Accident.find();
    console.log(`- Total accidents: ${accidents.length}`);
    console.log(`- Verified accidents: ${accidents.filter(a => a.isVerified).length}`);
    console.log(`- Critical severity: ${accidents.filter(a => a.severity === 'Critical').length}`);
    console.log(`- High severity: ${accidents.filter(a => a.severity === 'High').length}`);
    console.log(`- Moderate severity: ${accidents.filter(a => a.severity === 'Moderate').length}`);
    console.log(`- Low severity: ${accidents.filter(a => a.severity === 'Low').length}`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedDatabase();
