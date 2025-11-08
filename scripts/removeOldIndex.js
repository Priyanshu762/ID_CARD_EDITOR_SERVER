const mongoose = require('mongoose');

async function removeOldIndex() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/idcard_system';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // List all indexes
    console.log('\nCurrent indexes:');
    const indexes = await usersCollection.indexes();
    indexes.forEach(index => {
      console.log(`- ${index.name}:`, index.key);
    });

    // Drop the employeeId_1 index if it exists
    try {
      await usersCollection.dropIndex('employeeId_1');
      console.log('\n✓ Successfully dropped employeeId_1 index');
    } catch (error) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('\n⚠ Index employeeId_1 not found (may have been already removed)');
      } else {
        throw error;
      }
    }

    // List indexes after removal
    console.log('\nIndexes after removal:');
    const newIndexes = await usersCollection.indexes();
    newIndexes.forEach(index => {
      console.log(`- ${index.name}:`, index.key);
    });

    console.log('\n✓ Process completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

removeOldIndex();
