import { CarDto } from '@app/api/car/dtos/car.dto';
import { Car } from '@app/api/car/models/car.model';
import { CarService } from '@app/api/car/services/car.service';
import { Roles } from '@app/common/decorators/roles.decorator';
import { AuthenticateGuard } from '@app/common/guards/authenticate.guard';
import { AuthorizeGuard } from '@app/common/guards/authorize.guard';
import { uuidRegex } from '@app/common/utils/uuid-regex.util';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate';

@ApiTags('car')
@ApiBearerAuth()
@Controller('cars')
@UseGuards(AuthenticateGuard, AuthorizeGuard)
// # Car controller class
export class CarController {
  constructor(
    // Private methods only accessible from inside the class
    private readonly carService: CarService,
    private readonly configService: ConfigService,
  ) {}

  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @Get()
  @Roles('admin')
  // Index function for getting all the cars
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Car>> {
    return this.carService.getCars({
      page: Number(page),
      limit: Number(limit),
      route: `${this.configService.get('APP_BASE_URL')}/cars`,
    });
  }

  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Get(`:id(${uuidRegex})`)
  @Roles('admin')
  async show(@Param('id') id: string): Promise<Car> {
    const car = await this.carService.getCarByIdWithRelationship(id);
    if (!car) throw new NotFoundException('Car not found');
    return car;
  }

  // # Controller for adding a new car
  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  @Roles('admin')
  // This async function adds a new car to the database
  async store(@Body() carDto: CarDto): Promise<Car> {
    return this.carService.insertCar(carDto);
  }

  // # controller for Searching a car from database with id
  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Put(`:id(${uuidRegex})`)
  @Roles('admin')
  async update(
    // Extracting id from the request parametres
    @Param('id') id: string,
    @Body() carDto: CarDto,
  ): Promise<Car & CarDto> {
    // searching for the car in the database for the provided id in the request
    const car = await this.carService.getCarById(id);

    // If not car then throw not found error
    if (!car) throw new NotFoundException('Car not found');

    // Else pass the id and carDto with to the update car service
    await this.carService.updateCar(id, carDto);

    // Returning the car from the id passed and the dto object
    return { ...car, ...carDto };
  }

  // # Delete car controller
  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(`:id(${uuidRegex})`)
  @Roles('admin')
  @HttpCode(204)
  async destroy(
    // Extracting id from the request paramatres
    @Param('id') id: string,
  ): Promise<void> {
    // Searching for the car in the database from the id passed in the request
    const car = await this.carService.getCarById(id);

    // If car is not found then throw not found error
    if (!car) throw new NotFoundException('Car not found');

    // else pass the id to the delete car service
    await this.carService.deleteCar(id);
  }
}
