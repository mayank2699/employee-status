import { Router } from "express";
import {
  getEmployeeLeaves,
  updateMonthLeave,
  updateEmployeeLeaves,
} from "controllers/employees.controller";

const router = Router();

router.put("/employeeLeaves/:id", getEmployeeLeaves);
router.get("/employee-leave/:id", updateEmployeeLeaves);
router.get("/employee-leave", updateMonthLeave);

export default router;
