import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  employeeType: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true })
  basicSalary: number;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  joinDate: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
