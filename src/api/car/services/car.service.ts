import { CarDto } from '@app/api/car/dtos/car.dto';
import { Car } from '@app/api/car/models/car.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

// # Car service injectable form
@Injectable()
export class CarService {
  constructor(
    // Injecting the car reposiory to the constructor for its use in the class
    @InjectRepository(Car)
    private readonly carRepository: Repository<Car>,
  ) {}

  getCars(paginationOptions: IPaginationOptions): Promise<Pagination<Car>> {
    // getting all cars form the database repository
    return paginate(this.carRepository, paginationOptions, {
      relations: ['carCategory'],
    });
  }

  getCarById(id: string): Promise<Car | undefined> {
    // getting car with only id passed from the database repository
    return this.carRepository.findOne(id);
  }

  getCarByIdWithRelationship(id: string): Promise<Car | undefined> {
    // Getting car with some relationship such as car category
    return this.carRepository.findOne(id, {
      relations: ['carCategory'],
    });
  }

  insertCar({ carCategoryId, price }: CarDto): Promise<Car> {
    return this.carRepository.save({
      // saving new car with the id and in respective car category
      carCategory: { id: carCategoryId },
      price,
    });
  }

  updateCar(
    id: string,
    { carCategoryId, price }: CarDto,
  ): Promise<UpdateResult> {
    // UPdating car in the stored repository
    return this.carRepository.update(id, {
      carCategory: { id: carCategoryId },
      price,
    });
  }

  deleteCar(id: string): Promise<DeleteResult> {
    // Deleting car instance from the repostory
    return this.carRepository.delete(id);
  }
}
