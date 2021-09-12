import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './schemas/users.schema';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../../decorators/roles-auth.decorator';
import { ROLES } from '../../const/roles';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@ApiTags('Пользователи')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: 200, type: [User] })
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.usersService.getAllUsers();
  }

  @ApiOperation({ summary: 'Получить одного пользователя по id' })
  @ApiResponse({ status: 200, type: User })
  @Get(':id')
  getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.getUser(id);
  }

  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  createUser(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  @ApiOperation({ summary: 'Обновить данные пользователя' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() userDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, userDto);
  }

  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 200, type: User })
  @ApiBearerAuth()
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  removeUser(@Param('id') id: string): Promise<User> {
    return this.usersService.removeUser(id);
  }
}
