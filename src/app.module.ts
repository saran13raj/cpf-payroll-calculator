import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CPFModule } from './cpf/cpf.module';
import { EmployeeModule } from './employee/employee.module';

const dbURL = 'mongodb://localhost:27017';

@Module({
  imports: [
    MongooseModule.forRoot(dbURL, {
      dbName: 'cpf-local',
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          Logger.log('MongoDB is connected');
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
