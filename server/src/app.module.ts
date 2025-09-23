/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MatchesModule } from './matches/matches.module';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb+srv://wasifbinnasir:wasifbinnasir@cluster0.h8sdsew.mongodb.net/CricketStats?retryWrites=true&w=majority&appName=Cluster0', {
      // optional options
    }),
    MatchesModule,
  ],
})
export class AppModule {}
