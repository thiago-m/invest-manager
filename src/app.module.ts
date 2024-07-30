import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config'
import { AppService } from './app.service';
import { InvestModule } from './modules/invest/invest.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import configuration from './config/configuration';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/invest-manage', { dbName: 'invest-manage' }),
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }),
    ScheduleModule.forRoot(),
    UserModule,
    AuthModule,
    InvestModule,
  ],
  providers: [AppService],
})
export class AppModule {}
