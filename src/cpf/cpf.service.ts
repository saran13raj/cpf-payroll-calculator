import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CPFRate } from './cpf.schema';
import {
  CPFContribution,
  EmployeeType,
  AgeGroup,
  PayrollDetails,
  //   WageType,
} from './cpf.types';
import { CONTRIBUTION_ALLOCATION, CPF_LIMITS } from './cpf.constants';

@Injectable()
export class CPFCalculatorService {
  private readonly logger = new Logger(CPFCalculatorService.name);

  constructor(
    @InjectModel(CPFRate.name)
    private cpfRateModel: Model<CPFRate>,
  ) {}

  async calculatePayrollCPF(
    employeeId: string,
    payrollDetails: PayrollDetails,
    employeeType: EmployeeType,
    age: number,
  ): Promise<CPFContribution> {
    try {
      // Validate input data
      this.validatePayrollData(payrollDetails);

      const ageGroup = this.determineAgeGroup(age);
      const rates = await this.getCPFRates(employeeType, ageGroup);

      // Calculate ordinary wages contribution
      const ordinaryWagesContribution =
        await this.calculateOrdinaryWagesContribution(
          payrollDetails.basicSalary,
          rates,
        );

      // Calculate additional wages contribution
      const additionalWagesContribution =
        await this.calculateAdditionalWagesContribution(payrollDetails, rates);

      // Combine contributions
      const totalContribution = this.combineCPFContributions(
        ordinaryWagesContribution,
        additionalWagesContribution,
      );
      console.log(
        'c:::',
        ordinaryWagesContribution,
        additionalWagesContribution,
        totalContribution,
      );

      // Allocate to different accounts based on age
      const allocatedContribution = this.allocateToAccounts(
        totalContribution,
        age,
      );

      // Round all amounts to nearest cent as per CPF requirements
      return this.roundContributionAmounts(allocatedContribution);
    } catch (error) {
      this.logger.error(`CPF calculation failed: ${error.message}`);
      throw new HttpException(
        `CPF calculation failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private determineAgeGroup(age: number): AgeGroup {
    if (age < 55) return AgeGroup.LESS_THAN_55;
    if (age < 60) return AgeGroup.FROM_55_TO_60;
    if (age < 65) return AgeGroup.FROM_60_TO_65;
    return AgeGroup.ABOVE_65;
  }

  async getCPFRates(
    employeeType: EmployeeType,
    ageGroup: AgeGroup,
  ): Promise<CPFRate> {
    const rates = await this.cpfRateModel
      .findOne({
        employeeType,
        ageGroup,
        effectiveDate: { $lte: new Date() },
      })
      .sort({ effectiveDate: -1 })
      .exec();

    if (!rates) {
      this.logger.error('CPF rates not found for the given criteria');
      throw new HttpException(
        'CPF rates not found for the given criteria',
        HttpStatus.BAD_REQUEST,
      );
    }

    return rates;
  }

  private combineCPFContributions(
    ordinaryWagesContribution: CPFContribution,
    additionalWagesContribution: CPFContribution,
  ): CPFContribution {
    return {
      employeeContribution:
        ordinaryWagesContribution.employeeContribution +
        additionalWagesContribution.employeeContribution,
      employerContribution:
        ordinaryWagesContribution.employerContribution +
        additionalWagesContribution.employerContribution,
      totalContribution:
        ordinaryWagesContribution.totalContribution +
        additionalWagesContribution.totalContribution,
      medisave:
        ordinaryWagesContribution.medisave +
        additionalWagesContribution.medisave,
      special:
        ordinaryWagesContribution.special + additionalWagesContribution.special,
      ordinary:
        ordinaryWagesContribution.ordinary +
        additionalWagesContribution.ordinary,
    };
  }

  private validatePayrollData(payrollDetails: PayrollDetails): void {
    if (payrollDetails.basicSalary < CPF_LIMITS.MINIMUM_WAGE_THRESHOLD) {
      this.logger.error(
        `Salary below minimum threshold of $${CPF_LIMITS.MINIMUM_WAGE_THRESHOLD}`,
      );
      throw new HttpException(
        `Salary below minimum threshold of $${CPF_LIMITS.MINIMUM_WAGE_THRESHOLD}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      payrollDetails.totalOrdinaryWagesYTD >
      CPF_LIMITS.ORDINARY_WAGE_CEILING * 12
    ) {
      this.logger.error('Year-to-date ordinary wages exceed annual ceiling');
      throw new HttpException(
        'Year-to-date ordinary wages exceed annual ceiling',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async calculateOrdinaryWagesContribution(
    salary: number,
    rates: CPFRate,
  ): Promise<CPFContribution> {
    const cappedSalary = Math.min(salary, CPF_LIMITS.ORDINARY_WAGE_CEILING);

    // Apply graduated employer and employee rates based on salary range
    const { employerRate, employeeRate } = this.getApplicableRates(
      cappedSalary,
      rates,
    );

    const employerContribution = cappedSalary * employerRate;
    const employeeContribution = cappedSalary * employeeRate;

    return {
      employeeContribution,
      employerContribution,
      totalContribution: employerContribution + employeeContribution,
      ordinary: 0, // Will be allocated later
      special: 0,
      medisave: 0,
    };
  }

  private async calculateAdditionalWagesContribution(
    payrollDetails: PayrollDetails,
    rates: CPFRate,
  ): Promise<CPFContribution> {
    const { additionalWages, totalOrdinaryWagesYTD, totalAdditionalWagesYTD } =
      payrollDetails;

    // Calculate Additional Wages Ceiling
    const remainingAWCeiling = this.calculateRemainingAWCeiling(
      totalOrdinaryWagesYTD,
      totalAdditionalWagesYTD,
    );

    if (remainingAWCeiling <= 0) {
      return {
        employeeContribution: 0,
        employerContribution: 0,
        totalContribution: 0,
        ordinary: 0,
        special: 0,
        medisave: 0,
      };
    }

    const cappedAdditionalWage = Math.min(additionalWages, remainingAWCeiling);

    const { employerRate, employeeRate } = this.getApplicableRates(
      payrollDetails.basicSalary, // Use monthly salary to determine rate
      rates,
    );

    return {
      employeeContribution: cappedAdditionalWage * employeeRate,
      employerContribution: cappedAdditionalWage * employerRate,
      totalContribution: cappedAdditionalWage * (employeeRate + employerRate),
      ordinary: 0,
      special: 0,
      medisave: 0,
    };
  }

  private calculateRemainingAWCeiling(
    totalOrdinaryWagesYTD: number,
    totalAdditionalWagesYTD: number,
  ): number {
    return Math.max(
      0,
      CPF_LIMITS.ADDITIONAL_WAGE_CEILING -
        totalOrdinaryWagesYTD -
        totalAdditionalWagesYTD,
    );
  }

  private getApplicableRates(
    salary: number,
    rates: CPFRate,
  ): { employerRate: number; employeeRate: number } {
    // Implement graduated contribution rates based on salary
    // This should follow the exact CPF contribution rate tables
    // Different rates for different salary ranges
    return {
      employerRate: rates.employerRate / 100,
      employeeRate: rates.employeeRate / 100,
    };
  }

  private allocateToAccounts(
    contribution: CPFContribution,
    age: number,
  ): CPFContribution {
    const allocation = this.getAllocationRatios(age);
    const totalContribution = contribution.totalContribution;

    return {
      ...contribution,
      medisave: totalContribution * allocation.MEDISAVE,
      special: totalContribution * allocation.SPECIAL,
      ordinary:
        totalContribution -
        totalContribution * allocation.SPECIAL -
        totalContribution * allocation.MEDISAVE,
    };
  }

  private getAllocationRatios(age: number) {
    if (age < 55) return CONTRIBUTION_ALLOCATION.LESS_THAN_55;
    if (age < 60) return CONTRIBUTION_ALLOCATION.FROM_55_TO_60;
    if (age < 65) return CONTRIBUTION_ALLOCATION.FROM_60_TO_65;
    return CONTRIBUTION_ALLOCATION.ABOVE_65;
  }

  private roundContributionAmounts(
    contribution: CPFContribution,
  ): CPFContribution {
    return {
      employeeContribution:
        Math.round(contribution.employeeContribution * 100) / 100,
      employerContribution:
        Math.round(contribution.employerContribution * 100) / 100,
      totalContribution: Math.round(contribution.totalContribution * 100) / 100,
      medisave: Math.round(contribution.medisave * 100) / 100,
      special: Math.round(contribution.special * 100) / 100,
      ordinary: Math.round(contribution.ordinary * 100) / 100,
    };
  }
}
