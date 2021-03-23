import { ClientDto } from '@app/api/client/dtos/client.dto';
import { Client } from '@app/api/client/models/client.model';
import { ClientService } from '@app/api/client/services/client.service';
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

// # Client controller class initiation
@ApiTags('client')
@ApiBearerAuth()
@Controller('clients')
// decorators for authantication required
@UseGuards(AuthenticateGuard, AuthorizeGuard)
export class ClientController {
  constructor(
    // passing the client service in the constructore for future use
    private readonly clientService: ClientService,
    private readonly configService: ConfigService,
  ) {}

  // controller method for retrieving all the clients from the database
  @ApiQuery({ name: 'page', example: 1, required: false })
  @ApiQuery({ name: 'limit', example: 10, required: false })
  @Get()
  @Roles('admin')
  async index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<Client>> {
    return this.clientService.getClients({
      page: Number(page),
      limit: Number(limit),
      route: `${this.configService.get('APP_BASE_URL')}/clients`,
    });
  }

  // method for returning specific client from the provided id
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Get(`:id(${uuidRegex})`)
  @Roles('admin')
  async show(@Param('id') id: string): Promise<Client> {
    // looking for the client with the provided id
    const client = await this.clientService.getClientById(id);

    // if client not found thorw not found exception
    if (!client) throw new NotFoundException('Client not found');

    // else return the client to the user
    return client;
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @Post()
  @Roles('admin')
  // Adding new client to the database
  async store(@Body() clientDto: ClientDto): Promise<Client> {
    // passing the dto to the insert client service
    return this.clientService.insertClient(clientDto);
  }

  @ApiBadRequestResponse({ description: 'Request body validation errors.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Put(`:id(${uuidRegex})`)
  @Roles('admin')
  // upating the existing client
  async update(
    // retrieving the id and the dto from the request parametres
    @Param('id') id: string,
    @Body() clientDto: ClientDto,
  ): Promise<Client> {
    // looking for the id in the database for client
    const client = await this.clientService.getClientById(id);

    // if client not found throw not found exception error
    if (!client) throw new NotFoundException('Client not found');

    // else pass the id and the dto to the update client service
    await this.clientService.updateClient(id, clientDto);

    return { ...client, ...clientDto };
  }

  @ApiNoContentResponse({ description: 'No content http response.' })
  @ApiNotFoundResponse({ description: 'Not found exception response.' })
  @Delete(`:id(${uuidRegex})`)
  @Roles('admin')
  @HttpCode(204)
  // deleting the client with the provided id
  async destroy(@Param('id') id: string): Promise<void> {
    // looking for the client from the id in the database
    const client = await this.clientService.getClientById(id);

    // if client not found throw a not found exception
    if (!client) throw new NotFoundException('Client not found');

    // else pass the id to the delete service
    await this.clientService.deleteClient(id);
  }
}
