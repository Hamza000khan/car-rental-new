import { CarCategoryDto } from '@app/api/car-category/dtos/car-category.dto';
import { CarCategory } from '@app/api/car-category/models/car-category.model';
import { CarCategoryService } from '@app/api/car-category/services/car-category.service';
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

// # Car category controller class
@ApiTags('car-category')
@ApiBearerAuth()
@Controller('car-categories')
@UseGuards(AuthenticateGuard, AuthorizeGuard)
export class CarCategoryController {
  constructor(
    private readonly carCategoryService: CarCategoryService,
    private readonly configService: ConfigService,
  ) {}

  // controller class methods
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @Get()
  @Roles('admin')
  // For getting all the categories from the database
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<CarCategory>> {
    return this.carCategoryService.getCarCategories({
      page: Number(page),
      limit: Number(limit),
      route: `${this.configService.get('APP_BASE_URL')}/car-categories`,
    });
  }

  // Getting the car category with specific id
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Get(`:id(${uuidRegex})`)
  @Roles('admin')
  // extracting the id passed in the request parametres
  async show(@Param('id') id: string): Promise<CarCategory> {
    // checking if the car pository with the passed id is present in the database
    const carCategory = await this.carCategoryService.getCarCategoryById(id);

    // IF no car category is found in the database throw not found error
    if (!carCategory) throw new NotFoundException('Car category not found');

    // else return found car category
    return carCategory;
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  @Roles('admin')
  async store(@Body() carCategoryDto: CarCategoryDto): Promise<CarCategory> {
    return this.carCategoryService.insertCarCategory(carCategoryDto);
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Put(`:id(${uuidRegex})`)
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() carCategoryDto: CarCategoryDto,
  ): Promise<CarCategory> {
    const carCategory = await this.carCategoryService.getCarCategoryById(id);
    if (!carCategory) throw new NotFoundException('Car category not found');

    await this.carCategoryService.updateCarCategory(id, carCategoryDto);

    return { ...carCategory, ...carCategoryDto };
  }

  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(`:id(${uuidRegex})`)
  @Roles('admin')
  @HttpCode(204)
  async destroy(@Param('id') id: string): Promise<void> {
    const carCategory = await this.carCategoryService.getCarCategoryById(id);
    if (!carCategory) throw new NotFoundException('Car category not found');

    await this.carCategoryService.deleteCarCategory(id);
  }
}
