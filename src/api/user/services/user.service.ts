import { UserDto } from '@app/api/user/dtos/user.dto';
import { User } from '@app/api/user/models/user.model';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

// # user service class initiation
@Injectable()
export class UserService {
  constructor(
    // Injecting the user repository in the constructor so it can be used inside the class
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // getting all users from the database
  getUsers(paginationOptions: IPaginationOptions): Promise<Pagination<User>> {
    return paginate(this.userRepository, paginationOptions);
  }

  // getting a user with specific id
  getUserById(id: string): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  // getting user by username
  getUserByUsername(username: string): Promise<User | undefined> {
    return this.userRepository.findOne({ username });
  }

  // adding a new user to the database
  insertUser(userDto: UserDto): Promise<User> {
    return this.userRepository.save(
      Object.assign(
        new User(),
        // passing the data to the object in with spread operator
        { ...userDto },
      ),
    );
  }

  // updating any preexisting user in the database
  updateUser(id: string, userDto: UserDto): Promise<UpdateResult> {
    return this.userRepository.update(id, userDto);
  }

  // deleting any user from the database
  deleteUser(id: string): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
