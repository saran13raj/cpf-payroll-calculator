import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CPFModule } from './cpf/cpf.module';
import { EmployeeModule } from './employee/employee.module';

const DATABASE_NAME = process.env.DATABASE_NAME ?? 'cpf-local';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL, {
      dbName: DATABASE_NAME,
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          Logger.log('MongoDB is connected to db >> ' + DATABASE_NAME);
        });
        connection._events.connected();
        return connection;
      },
    }),
    CPFModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
