import express from "express";
import { create, update } from "../controller/inventoryController.js";

const router = express.Router();

router.post("/create", create);
router.post("/update/:objectId", update); // query string
export default router;
