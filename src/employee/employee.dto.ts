import { IsString, IsNumber } from 'class-validator';

export class EmployeeResponseDto {
  @IsString()
  _id: string;

  @IsString()
  name: string;

  @IsString()
  employeeType: string;

  @IsString()
  dateOfBirth: Date;

  @IsNumber()
  basicSalary: number;

  @IsString()
  department: string;

  @IsString()
  joinDate: string;
}
