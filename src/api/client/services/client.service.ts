import { ClientDto } from '@app/api/client/dtos/client.dto';
import { Client } from '@app/api/client/models/client.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

// # client services with injectable decorator
@Injectable()
export class ClientService {
  constructor(
    // Injecting the client repository in the constructor so that it can be used inside the class
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  // get all the clients
  getClients(
    paginationOptions: IPaginationOptions,
  ): Promise<Pagination<Client>> {
    return paginate(this.clientRepository, paginationOptions);
  }

  // get client with id
  getClientById(id: string): Promise<Client | undefined> {
    return this.clientRepository.findOne(id);
  }

  // add a client to the database
  insertClient(clientDto: ClientDto): Promise<Client> {
    return this.clientRepository.save(clientDto);
  }

  // updating a preexisting client in the database
  updateClient(id: string, clientDto: ClientDto): Promise<UpdateResult> {
    return this.clientRepository.update(id, clientDto);
  }

  // delete a client from the database with the provided id
  deleteClient(id: string): Promise<DeleteResult> {
    return this.clientRepository.delete(id);
  }
}
