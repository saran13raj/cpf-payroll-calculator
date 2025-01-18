import { IsNumber, IsString, IsEnum, IsOptional, Min } from 'class-validator';

export interface CPFContribution {
  employeeContribution: number;
  employerContribution: number;
  totalContribution: number;
  // Breakdown by accounts as per CPF allocation rules
  ordinary: number;
  special: number;
  medisave: number;
}

export enum WageType {
  ORDINARY_WAGES = 'ORDINARY_WAGES',
  ADDITIONAL_WAGES = 'ADDITIONAL_WAGES',
}

export interface PayrollDetails {
  basicSalary: number;
  additionalWages: number;
  totalOrdinaryWagesYTD: number; // Year to date ordinary wages
  totalAdditionalWagesYTD: number; // Year to date additional wages
}

export enum EmployeeType {
  CITIZEN = 'CITIZEN',
  PR_FIRST_YEAR = 'PR_FIRST_YEAR',
  PR_SECOND_YEAR = 'PR_SECOND_YEAR',
}

export enum AgeGroup {
  LESS_THAN_55 = 'LESS_THAN_55',
  FROM_55_TO_60 = 'FROM_55_TO_60',
  FROM_60_TO_65 = 'FROM_60_TO_65',
  ABOVE_65 = 'ABOVE_65',
}

export class CalculateCPFDto {
  @IsString()
  employeeId: string;

  @IsNumber()
  @Min(0)
  basicSalary: number;

  @IsNumber()
  @Min(0)
  additionalWages: number;

  @IsNumber()
  @Min(0)
  totalOrdinaryWagesYTD: number;

  @IsNumber()
  @Min(0)
  totalAdditionalWagesYTD: number;

  @IsEnum(EmployeeType)
  employeeType: EmployeeType;

  @IsNumber()
  @Min(16)
  age: number;
}

export class BulkCPFCalculationDto {
  @IsString()
  payrollPeriod: string; // Format: YYYY-MM

  @IsOptional()
  @IsString()
  departmentId?: string;
}
