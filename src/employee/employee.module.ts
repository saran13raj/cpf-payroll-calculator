import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';

import { EmployeeService } from './employee.service';
import { Employee, EmployeeSchema } from './employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]),
    CacheModule.register(),
  ],
  providers: [EmployeeService],
  exports: [EmployeeService, MongooseModule],
})
export class EmployeeModule {}
