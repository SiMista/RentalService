const { client } = require("../../config/database");
const { ObjectId } = require("mongodb");

const db = client.db("RentalService");
const rentalsCollection = db.collection("rentals");

const createRental = async (req, res) => {
  const { userId, itemId, startDate, endDate, type, location, price } = req.body;

  try {
    console.log("Creating rental with data:", { userId, itemId, startDate, endDate, type, location, price });

    // Create new rental
    const result = await rentalsCollection.insertOne({ userId, itemId, startDate, endDate, type, location, price });
    console.log("Rental created:", result);

    // Fetch the newly created rental
    const newRental = await rentalsCollection.findOne({ _id: result.insertedId });
    res.json(newRental);
  } catch (err) {
    console.error("Error creating rental:", err.message);
    res.status(500).send("Server Error");
  }
};

const getAllRentals = async (req, res) => {
  try {
    const rentals = await rentalsCollection.find().toArray();
    res.json(rentals);
  } catch (err) {
    console.error("Error fetching all rentals:", err.message);
    res.status(500).send("Server Error");
  }
};

const getRentalById = async (req, res) => {
  try {
    const rental = await rentalsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!rental) {
      console.log("Rental not found with ID:", req.params.id);
      return res.status(404).json({ msg: "Rental not found" });
    }
    res.json(rental);
  } catch (err) {
    console.error("Error fetching rental by ID:", err.message);
    res.status(500).send("Server Error");
  }
};

const updateRental = async (req, res) => {
  const { userId, itemId, startDate, endDate } = req.body;

  try {
    if (!ObjectId.isValid(req.params.id)) {
      console.log("Invalid ID:", req.params.id);
      return res.status(400).json({ msg: "Invalid ID" });
    }

    let result = await rentalsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { userId, itemId, startDate, endDate } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      console.log("Rental not found with ID:", req.params.id);
      return res.status(404).json({ msg: "Rental not found" });
    }

    res.json(result.value);
  } catch (err) {
    console.error("Error updating rental:", err.message);
    res.status(500).send("Server Error");
  }
};

const deleteRental = async (req, res) => {
  try {
    let result = await rentalsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      console.log("Rental not found with ID:", req.params.id);
      return res.status(404).json({ msg: "Rental not found" });
    }
    res.json({ msg: "Rental removed" });
  } catch (err) {
    console.error("Error deleting rental:", err.message);
    res.status(500).send("Server Error");
  }
};

const searchRentals = async (req, res) => {
  const { type, location, minBudget, maxBudget } = req.query;

  try {
    const query = {};
    if (type) query.type = type;
    if (location) query.location = location;
    if (minBudget) query.price = { $gte: parseFloat(minBudget) };
    if (maxBudget) {
      if (!query.price) query.price = {};
      query.price.$lte = parseFloat(maxBudget);
    }

    const rentals = await rentalsCollection.find(query).toArray();
    res.json(rentals);
  } catch (err) {
    console.error("Error searching rentals:", err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createRental,
  getAllRentals,
  getRentalById,
  updateRental,
  deleteRental,
  searchRentals,
};
