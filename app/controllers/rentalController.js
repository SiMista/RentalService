const { client } = require("../../config/database");
const { ObjectId } = require("mongodb");

const db = client.db("RentalService");
const rentalsCollection = db.collection("rentals");

const createRental = async (req, res) => {
  const { userId, startDate, endDate, type, location, price } = req.body;

  try {
    const result = await rentalsCollection.insertOne({
      userId,
      startDate,
      endDate,
      type,
      location,
      price,
    });

    const newRental = await rentalsCollection.findOne({
      _id: result.insertedId,
    });
    res.json(newRental);
  } catch (err) {
    console.error("Error creating rental:", err.message);
    res.status(500).send("Server Error");
  }
};

const getAllRentals = async (req, res) => {
  try {
    const { tenantId, userId } = req.query;
    let query = {};

    if (tenantId) {
      query.tenantId = tenantId;
    }
    if (userId) {
      query.userId = userId;
    }

    const rentals = await rentalsCollection.find(query).toArray();
    res.json(rentals);
  } catch (err) {
    console.error("Error fetching rentals:", err.message);
    res.status(500).send("Server Error");
  }
};

const getRentalById = async (req, res) => {
  try {
    const rental = await rentalsCollection.findOne({
      _id: new ObjectId(req.params.id),
    });
    if (!rental) {
      return res.status(404).json({ msg: "Rental not found" });
    }
    res.json(rental);
  } catch (err) {
    console.error("Error fetching rental by ID:", err.message);
    res.status(500).send("Server Error");
  }
};

const requestRental = async (req, res) => {
  const { tenantId } = req.body;

  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    let result = await rentalsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { tenantId, process: "Requested" } },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ msg: "Rental not found" });
    }

    res.json(result);
  } catch (err) {
    console.error("Error requesting rental:", err.message);
    res.status(500).send("Server Error");
  }
};

const acceptRental = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    let result = await rentalsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { process: "Rented" } },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ msg: "Rental not found" });
    }

    res.json(result);
  } catch (err) {
    console.error("Error accepting rental:", err.message);
    res.status(500).send("Server Error");
  }
};

const rejectRental = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    let result = await rentalsCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $unset: { tenantId: "", process: "" } },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ msg: "Rental not found" });
    }

    res.json(result);
  } catch (err) {
    console.error("Error rejecting rental:", err.message);
    res.status(500).send("Server Error");
  }
};

const deleteRental = async (req, res) => {
  try {
    let result = await rentalsCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ msg: "Rental not found" });
    }
    res.json({ msg: "Rental removed" });
  } catch (err) {
    console.error("Error deleting rental:", err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  createRental,
  getAllRentals,
  getRentalById,
  requestRental,
  acceptRental,
  rejectRental,
  deleteRental,
};
