import { CarCategoryDto } from '@app/api/car-category/dtos/car-category.dto';
import { CarCategory } from '@app/api/car-category/models/car-category.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

// # Car category service class
@Injectable()
export class CarCategoryService {
  constructor(
    // Injeccting the car category repository to the constructory which can be used within the class
    @InjectRepository(CarCategory)
    private readonly carCategoryRepository: Repository<CarCategory>,
  ) {}

  // Getting all car categories
  getCarCategories(
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<CarCategory>> {
    return paginate(this.carCategoryRepository, paginationOptions);
  }

  // GEtting car categories with their specific id
  getCarCategoryById(id: string): Promise<CarCategory | undefined> {
    // requesting the passed category id to the car category repository
    return this.carCategoryRepository.findOne(id);
  }

  // Adding new car category to the database
  insertCarCategory(carCategoryDto: CarCategoryDto): Promise<CarCategory> {
    // Passing the dto to the car category repository
    return this.carCategoryRepository.save(carCategoryDto);
  }

  // Updating the existing car category stored in the database
  updateCarCategory(
    id: string,
    carCategoryDto: CarCategoryDto,
  ): Promise<UpdateResult> {
    return this.carCategoryRepository.update(id, carCategoryDto);
  }

  // Method for deleting car category with a specifc provided id
  deleteCarCategory(id: string): Promise<DeleteResult> {
    return this.carCategoryRepository.delete(id);
  }
}
