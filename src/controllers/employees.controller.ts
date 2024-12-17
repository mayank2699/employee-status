import Employees from "models/employees";
import { Request, Response } from "express";
import { ApiResponse } from "utils/ApiResponse";
import asyncHandeler from "utils/asyncHandeler";
import { createCustomError } from "utils/customError";
import cron from "node-cron";

export const getEmployeeLeaves = asyncHandeler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const employeeData = await Employees.findOne({
      where: { id: id },
    });
    if (!employeeData) {
      throw createCustomError("No data found", 404);
    }

    return res.status(200).json(
      new ApiResponse(200, "Employee leave data found Successfully", {
        data: employeeData,
      })
    );
  }
);

export const updateEmployeeLeaves = asyncHandeler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { sickLeave, priviligeLeave, shortLeave, date } = req.body;

    const employeeData = await Employees.findOne({
      where: { id: id },
    });

    if (!employeeData) {
      throw createCustomError("No data found", 404);
    }

    if (shortLeave && date) {
      throw createCustomError("Short leave should not include a date", 400);
    }

    if ((sickLeave || priviligeLeave) && !date) {
      throw createCustomError(
        "Date is required for sick leave or privilege leave",
        400
      );
    }

    if (sickLeave && employeeData.sickLeave <= 0) {
      throw createCustomError("No sick leave remaining", 400);
    }
    if (priviligeLeave && employeeData.priviligeLeave <= 0) {
      throw createCustomError("No privilege leave remaining", 400);
    }

    if (sickLeave) {
      employeeData.sickLeave -= sickLeave;
    }
    if (priviligeLeave) {
      employeeData.priviligeLeave -= priviligeLeave;
    }
    if (shortLeave) {
      employeeData.shortLeave += shortLeave; // Assuming short leave is incremented
    }

    await Employees.update(employeeData, {
      where: {
        id: id,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Leave update successfully"));
  }
);

async function updateLeaves() {
  const currentDate = new Date();
  const isJanuaryFirst =
    currentDate.getMonth() === 0 && currentDate.getDate() === 1;
  const isFirstOfMonth = currentDate.getDate() === 1;
  const employees = await Employees.findAll();

  for (const employee of employees) {
    if (isJanuaryFirst) {
      employee.priviligeLeave += 1;
      employee.sickLeave = 1;
      employee.shortLeave = 3;
    } else if (isFirstOfMonth) {
      employee.priviligeLeave += 1;
      employee.sickLeave += 1;
      employee.shortLeave = 3;
    }

    await employee.update(employee, {
      where: {
        id: employee.id,
      },
    });
  }
}

cron.schedule("0 0 1 * *", () => {
  updateLeaves();
});

export const updateMonthLeave = asyncHandeler(
  async (req: Request, res: Response) => {
    await updateLeaves();

    return res
      .status(200)
      .json(new ApiResponse(200, "Leave update successfully"));
  }
);
