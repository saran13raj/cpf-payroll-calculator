import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';

import { CPFCalculatorService } from './cpf.service';
import { CPFRate, CPFRateSchema } from './cpf.schema';
import { CPFController } from './cpf.controller';
import { EmployeeModule } from 'src/employee/employee.module';
import { CustomLoggerService } from 'src/logger/logger.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CPFRate.name, schema: CPFRateSchema }]),
    CacheModule.register(),
    EmployeeModule,
  ],
  providers: [CPFCalculatorService, CustomLoggerService],
  controllers: [CPFController],
  exports: [CPFCalculatorService, MongooseModule],
})
export class CPFModule {}
