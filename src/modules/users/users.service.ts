import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from './schemas/users.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
const ObjectId = require("mongodb").ObjectID;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
  ) {}

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.usersModel.find({}).populate('posts').exec();
    } catch (e) {
      throw new HttpException('Users no found', HttpStatus.NOT_FOUND);
    }
  }

  async getUser(id: string): Promise<User> {
    try {
      return await this.usersModel.findById(id).populate('posts').exec();
    } catch (e) {
      throw new HttpException('User no found', HttpStatus.NOT_FOUND);
    }
  }

  async getByEmailOrUsername(login: string) {
    try {
      return await this.usersModel
        .findOne({
          $or: [{ email: login }, { username: login }],
        })
        .exec();
    } catch (e) {
      throw new HttpException('User no found', HttpStatus.NOT_FOUND);
    }
  }

  async createUser(userDto: CreateUserDto): Promise<User> {
    try {
      const newUser = new this.usersModel(userDto);
      return await newUser.save();
    } catch (e) {
      throw new HttpException(
        'Create user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: string, userDto: UpdateUserDto): Promise<User> {
    try {
      return await this.usersModel
        .findByIdAndUpdate(id, userDto, { new: true })
        .populate('posts')
        .exec();
    } catch (e) {
      throw new HttpException(
        'Update user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeUser(id: string): Promise<User> {
    try {
      return await this.usersModel.findByIdAndDelete(id);
    } catch (e) {
      throw new HttpException(
        'Remove user error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
