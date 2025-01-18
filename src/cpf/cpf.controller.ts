import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { IsNumber, IsString, IsEnum, IsOptional, Min } from 'class-validator';

import { CPFCalculatorService } from './cpf.service';
import { AgeGroup, EmployeeType } from './cpf.types';

class CalculateCPFDto {
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

class BulkCPFCalculationDto {
  @IsString()
  payrollPeriod: string; // Format: YYYY-MM

  @IsOptional()
  @IsString()
  departmentId?: string;
}

@Controller('cpf')
export class CPFController {
  constructor(private readonly cpfCalculatorService: CPFCalculatorService) {}

  @Post('calculate')
  async calculateCPF(@Body(ValidationPipe) calculateCPFDto: CalculateCPFDto) {
    const payrollDetails = {
      basicSalary: calculateCPFDto.basicSalary,
      additionalWages: calculateCPFDto.additionalWages,
      totalOrdinaryWagesYTD: calculateCPFDto.totalOrdinaryWagesYTD,
      totalAdditionalWagesYTD: calculateCPFDto.totalAdditionalWagesYTD,
    };

    return this.cpfCalculatorService.calculatePayrollCPF(
      calculateCPFDto.employeeId,
      payrollDetails,
      calculateCPFDto.employeeType,
      calculateCPFDto.age,
    );
  }

  @Post('bulk-calculate')
  async bulkCalculateCPF(
    @Body(ValidationPipe) bulkCPFDto: BulkCPFCalculationDto,
  ) {
    // Implementation for bulk calculation
    // This would typically fetch employee data and calculate CPF for multiple employees
    return {
      message: 'Bulk calculation initiated',
      period: bulkCPFDto.payrollPeriod,
    };
  }

  @Get('rates')
  async getCPFRates(
    @Query('employeeType') employeeType: EmployeeType,
    @Query('ageGroup') ageGroup: AgeGroup,
  ) {
    return this.cpfCalculatorService.getCPFRates(employeeType, ageGroup);
  }

  @Get('history/:employeeId')
  async getEmployeeCPFHistory(
    @Param('employeeId') employeeId: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    // Implementation for fetching CPF history
    return { employeeId, startDate, endDate };
  }
}
