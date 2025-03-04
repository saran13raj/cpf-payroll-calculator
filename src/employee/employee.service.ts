import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './employee.schema';

@Injectable()
export class EmployeeService {
  private readonly logger = new Logger(EmployeeService.name);

  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<Employee>,
  ) {}

  async getAllEmployeesByDepartment(department: string): Promise<Employee[]> {
    const employees = await this.employeeModel.find({
      department: department,
    });
    return employees;
  }
}
