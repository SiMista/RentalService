const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");

const {
    createRental,
    getAllRentals,
    getRentalById,
    updateRental,
    deleteRental,
    searchRentals,
  } = rentalController;

router.get("/rentals", getAllRentals);
router.post("/rentals", createRental);
router.get("/rentals/:id", getRentalById);
router.put("/rentals/:id", updateRental);
router.delete("/rentals/:id", deleteRental);
router.get("/rentals/search", searchRentals);


module.exports = router;
