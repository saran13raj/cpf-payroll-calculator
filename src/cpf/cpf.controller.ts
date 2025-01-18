import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { CPFCalculatorService } from './cpf.service';
import {
  AgeGroup,
  BulkCPFCalculationDto,
  CalculateCPFDto,
  EmployeeType,
} from './cpf.types';

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
    return this.cpfCalculatorService.bulkCalculateCPF(bulkCPFDto);
    // return {
    //   message: 'Bulk calculation initiated',
    //   period: bulkCPFDto.payrollPeriod,
    // };
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
