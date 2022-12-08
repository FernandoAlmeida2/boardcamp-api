import { Router } from "express";
import { getCustomer, getCustomers, postCustomer, putCustomer } from "../controllers/customers.controller.js";
import { customerMiddleware } from "../middlewares/customer.middleware.js";

const router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomer);

router.post("/customers", customerMiddleware, postCustomer);

router.put("/customers/:id", customerMiddleware, putCustomer);

export default router;