import { UserDto } from '@app/api/user/dtos/user.dto';
import { User } from '@app/api/user/models/user.model';
import { UserService } from '@app/api/user/services/user.service';
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

// # user controller class definition
@ApiTags('user')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthenticateGuard, AuthorizeGuard)
export class UserController {
  constructor(
    // adding the userservice in the constructor for the use inside the class
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  // getting all the users for the admin only
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @Get()
  @Roles('admin')
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<User>> {
    return this.userService.getUsers({
      // per page and limit set
      page: Number(page),
      limit: Number(limit),
      route: `${this.configService.get('APP_BASE_URL')}/users`,
    });
  }

  // retrieving a used with specific id
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Get(`:id(${uuidRegex})`)
  @Roles('admin')
  async show(
    // retrieving the id form the request parametres
    @Param('id') id: string,
  ): Promise<User> {
    // searching for user in the database
    const user = await this.userService.getUserById(id);

    // if user not found throw not found exception
    if (!user) throw new NotFoundException('User not found');

    // else return the found user
    return user;
  }

  // adding a user
  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  @Roles('admin')
  async store(
    // extacting the user dto form request body
    @Body() userDto: UserDto,
  ): Promise<User> {
    // passing the provided dto to the insert user service
    return this.userService.insertUser(userDto);
  }

  // updating an existing user
  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Put(`:id(${uuidRegex})`)
  @Roles('admin')
  async update(
    // retrieving the id and the dto from the request body and params
    @Param('id') id: string,
    @Body() userDto: UserDto,
  ): Promise<User> {
    // looking for the user with the provided id in the database
    const user = await this.userService.getUserById(id);

    // if user is not found throw not found exception error
    if (!user) throw new NotFoundException('User not found');

    // else pass the id and the dto to the update user service
    await this.userService.updateUser(id, userDto);

    return { ...user, ...userDto } as User;
  }

  // deleting a users
  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(`:id(${uuidRegex})`)
  @Roles('admin')
  @HttpCode(204)
  async destroy(
    // retrieving id from the request params
    @Param('id') id: string,
  ): Promise<void> {
    // checking if the user exist in the database
    const user = await this.userService.getUserById(id);

    // if user is not found throw not found error
    if (!user) throw new NotFoundException('User not found');

    // else pass the id to the delete user service
    await this.userService.deleteUser(id);
  }
}
