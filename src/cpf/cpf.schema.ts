import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { AgeGroup, EmployeeType } from './cpf.types';

@Schema({ timestamps: true, collection: 'cpf-rates' })
export class CPFRate extends Document {
  @Prop({ required: true })
  ageGroup: AgeGroup;

  @Prop({ required: true })
  employeeType: EmployeeType;

  @Prop({ required: true })
  employeeRate: number;

  @Prop({ required: true })
  employerRate: number;

  @Prop({ required: true })
  effectiveDate: Date;

  @Prop({ required: true })
  wageFloor: number;

  @Prop({ required: true })
  wageCeiling: number;
}

export const CPFRateSchema = SchemaFactory.createForClass(CPFRate);
