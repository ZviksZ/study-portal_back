import {Body, Controller, Delete, Get, Param, Patch, Query, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../guards/jwt-auth.guard";
import {Post as PostDecorator} from "@nestjs/common/decorators/http/request-mapping.decorator";
import {RequestUser} from "../../decorators/request-user.decorator";
import {Comment} from "./schemas/comments.schema";
import {CommentsService} from "./comments.service";
import {CreateCommentDto} from "./dto/create-comment.dto";
import {UpdateCommentDto} from "./dto/update-comment.dto";

@ApiTags('Комментарии')
@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
    constructor(private commentsService: CommentsService) {}

    @ApiOperation({ summary: 'Получить все комментарии(или для отдельного поста)'})
    @ApiResponse({ status: 200, type: [Comment] })
    @Get()
    getPostComments(@Query('post') postId): Promise<Comment[]> {
        return this.commentsService.getPostComments(postId);
    }

    @ApiOperation({ summary: 'Получить комментарий по id' })
    @ApiResponse({ status: 200, type: Comment })
    @Get(':id')
    getComment(@Param('id') id: string): Promise<Comment> {
        return this.commentsService.getComment(id);
    }

    @ApiOperation({ summary: 'Создать комментарий' })
    @ApiResponse({ status: 200, type: Comment })
    @ApiBearerAuth()
    @PostDecorator()
    createComment(
        @Body() commentDto: CreateCommentDto,
        @RequestUser() user,
    ): Promise<Comment> {
        return this.commentsService.createComment(commentDto, user._id);
    }

    @ApiOperation({ summary: 'Обновить комментарий' })
    @ApiResponse({ status: 200, type: Comment })
    @ApiBearerAuth()
    @Patch(':id')
    updateComment(
        @Param('id') id: string,
        @Body() commentDto: UpdateCommentDto,
        @RequestUser() user,
    ): Promise<Comment> {
        return this.commentsService.updateComment(id, commentDto);
    }

    @ApiOperation({ summary: 'Удалить комментарий' })
    @ApiResponse({ status: 200, type: Comment })
    @ApiBearerAuth()
    @Delete(':id')
    removeComment(@Param('id') commentId: string, @RequestUser() user): Promise<Comment> {
        return this.commentsService.removeComment(commentId, user._id);
    }
}