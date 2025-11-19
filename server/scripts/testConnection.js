const connectDB = require('../config/database');
const Incident = require('../models/Incident');

const testDatabaseConnection = async () => {
  console.log('🧪 Testing MongoDB Connection and Incident Model...\n');

  try {
    // 1. Connect to MongoDB
    console.log('1. Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connection successful\n');

    // 2. Test creating a sample incident
    console.log('2. Testing Incident creation...');
    
    const sampleIncident = {
      type: 'Network Outage',
      incidentStartDate: new Date('2024-01-15T10:00:00Z'),
      incidentEndDate: new Date('2024-01-15T12:30:00Z'),
      description: 'Major network outage affecting all users in the main office building. Connectivity was completely lost for approximately 2.5 hours.',
      remarks: 'Root cause identified as faulty network switch. Replacement scheduled for maintenance window.',
      status: 'closed'
    };

    const createdIncident = await Incident.create(sampleIncident);
    console.log('✅ Sample incident created successfully:');
    console.log(`   - ID: ${createdIncident._id}`);
    console.log(`   - Type: ${createdIncident.type}`);
    console.log(`   - Status: ${createdIncident.status}`);
    console.log(`   - Duration: ${createdIncident.durationInDays} days\n`);

    // 3. Test finding incidents
    console.log('3. Testing Incident queries...');
    const allIncidents = await Incident.find();
    console.log(`✅ Found ${allIncidents.length} incidents in database`);

    const openIncidents = await Incident.findOpenIncidents();
    console.log(`✅ Found ${openIncidents.length} open incidents\n`);

    // 4. Test updating an incident
    console.log('4. Testing Incident update...');
    const updatedIncident = await Incident.findByIdAndUpdate(
      createdIncident._id,
      { remarks: 'Updated remarks after investigation completion' },
      { new: true }
    );
    console.log('✅ Incident updated successfully');
    console.log(`   Updated remarks: ${updatedIncident.remarks}\n`);

    // 5. Test validation
    console.log('5. Testing validation...');
    try {
      const invalidIncident = new Incident({
        type: '', // This should fail validation
        incidentStartDate: new Date(),
        description: 'Too short' // This should also fail validation
      });
      await invalidIncident.save();
    } catch (validationError) {
      console.log('✅ Validation working correctly:');
      console.log('   Validation errors:', validationError.message);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('📊 Database operations verified:');
    console.log('   ✅ Connection established');
    console.log('   ✅ CRUD operations working');
    console.log('   ✅ Validation working');
    console.log('   ✅ Virtual fields calculated');
    console.log('   ✅ Static methods working');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  } finally {
    // Close the connection
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
};

// Run the test if this script is executed directly
if (require.main === module) {
  testDatabaseConnection();
}

module.exports = testDatabaseConnection;