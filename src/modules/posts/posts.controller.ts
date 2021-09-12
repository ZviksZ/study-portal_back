import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Post as PostDecorator,
} from '@nestjs/common';
import { Roles } from '../../decorators/roles-auth.decorator';
import { ROLES } from '../../const/roles';
import { RolesGuard } from '../../guards/roles.guard';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { Post } from './schemas/posts.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { RequestUser } from '../../decorators/request-user.decorator';

@ApiTags('Посты')
@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({ summary: 'Получить все посты' })
  @ApiResponse({ status: 200, type: [Post] })
  @Get()
  getAllPosts(@Query('user') userId): Promise<Post[]> {
    return this.postsService.getAllPosts(userId);
  }

  @ApiOperation({ summary: 'Получить пост по id' })
  @ApiResponse({ status: 200, type: Post })
  @Get(':id')
  getPost(@Param('id') id: string): Promise<Post> {
    return this.postsService.getPost(id);
  }

  @ApiOperation({ summary: 'Создать пост' })
  @ApiResponse({ status: 200, type: Post })
  @ApiBearerAuth()
  @PostDecorator()
  createPost(
    @Body() postDto: CreatePostDto,
    @RequestUser() user,
  ): Promise<Post> {
    console.log('CREATE POST');
    return this.postsService.createPost(postDto, user._id);
  }

  @ApiOperation({ summary: 'Обновить пост' })
  @ApiResponse({ status: 200, type: Post })
  @ApiBearerAuth()
  @Patch(':id')
  updatePost(
    @Param('id') id: string,
    @Body() postDto: UpdatePostDto,
    @RequestUser() user,
  ): Promise<Post> {
    return this.postsService.updatePost(id, postDto);
  }

  @ApiOperation({ summary: 'Удалить пост' })
  @ApiResponse({ status: 200, type: Post })
  @ApiBearerAuth()
  @Delete(':id')
  removePost(@Param('id') postId: string, @RequestUser() user): Promise<Post> {
    return this.postsService.removePost(postId, user._id);
  }
}
