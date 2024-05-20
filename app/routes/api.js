const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");

router.get("/rentals", rentalController.getAllRentals);
router.post("/rentals", rentalController.createRental);
router.get("/rentals/:id", rentalController.getRentalById);
router.put("/rentals/request/:id", rentalController.requestRental);
router.put("/rentals/accept/:id", rentalController.acceptRental);
router.put("/rentals/reject/:id", rentalController.rejectRental);
router.delete("/rentals/:id", rentalController.deleteRental);

module.exports = router;
