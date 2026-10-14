require('dotenv').config();
const mongoose = require('mongoose');

// 1. Connect to MongoDB Atlas using the URI from your .env file
mongoose.connect(process.env.MONGO_URI);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Successfully connected to MongoDB Atlas!');
});

// 2. Create the Person Schema (Blueprint)
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String] // Array of strings
});

// Create the Person Model from the Schema
const Person = mongoose.model('Person', personSchema);


// 3. Create and Save a Record of a Model
const createAndSavePerson = (done) => {
  const document = new Person({
    name: "John Doe",
    age: 25,
    favoriteFoods: ["Pizza", "Burgers"]
  });

  document.save((err, data) => {
    if (err) return console.error(err);
    done(null, data);
  });
};


// 4. Create Many Records with model.create()
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) return console.error(err);
    done(null, people);
  });
};


// 5. Use model.find() to Search Your Database by Name
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, personFound) => {
    if (err) return console.error(err);
    done(null, personFound);
  });
};


// 6. Use model.findOne() to Return a Single Matching Document by Food
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, person) => {
    if (err) return console.error(err);
    done(null, person);
  });
};


// 7. Use model.findById() to Search Your Database By _id
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return console.error(err);
    done(null, person);
  });
};


// 8. Perform Classic Updates by Running Find, Edit, then Save
const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById(personId, (err, person) => {
    if (err) return console.error(err);
  
    // Add "hamburger" to the list of favoriteFoods
    person.favoriteFoods.push(foodToAdd);

    // Save the updated person document
    person.save((err, updatedPerson) => {
      if (err) return console.error(err);
      done(null, updatedPerson);
    });
  });
};


// 9. Perform New Updates on a Document Using model.findOneAndUpdate()
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName }, 
    { age: ageToSet }, 
    { new: true }, // Returns the updated document
    (err, updatedDoc) => {
      if (err) return console.error(err);
      done(null, updatedDoc);
    }
  );
};


// 10. Delete One Document Using model.findByIdAndRemove()
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedDoc) => {
    if (err) return console.error(err);
    done(null, removedDoc);
  });
};


// 11. Delete Many Documents with model.remove()
const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove({ name: nameToRemove }, (err, outcome) => {
    if (err) return console.error(err);
    done(null, outcome);
  });
};


// 12. Chain Search Query Helpers to Narrow Search Results
const queryChain = (done) => {
  const foodToSearch = "burritos";

  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })      // Sort ascending by name
    .limit(2)               // Limit results to 2 documents
    .select('-age')         // Hide the age field
    .exec((err, data) => {  // Execute the query
      if (err) return console.error(err);
      done(null, data);
    });
};

// --- EXPORTS FOR CHECKPOINT TESTING ---
exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;