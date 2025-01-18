import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';

import { CPFCalculatorService } from './cpf.service';
import { CPFRate, CPFRateSchema } from './cpf.schema';
import { CPFController } from './cpf.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CPFRate.name, schema: CPFRateSchema }]),
    CacheModule.register(),
  ],
  providers: [CPFCalculatorService],
  controllers: [CPFController],
  exports: [CPFCalculatorService, MongooseModule],
})
export class CPFModule {}
