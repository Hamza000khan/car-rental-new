import { CarController } from '@app/api/car/controllers/car.controller';
import { Car } from '@app/api/car/models/car.model';
import { CarService } from '@app/api/car/services/car.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Module for the car which handle all the services, controller and models etc
@Module({
  imports: [TypeOrmModule.forFeature([Car])],
  controllers: [CarController],
  providers: [CarService],
})
export class CarModule {}
