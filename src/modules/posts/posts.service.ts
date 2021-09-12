import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/users.schema';
import { Post, PostDocument } from './schemas/posts.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
const ObjectId = require('mongodb').ObjectID;

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postsModel: Model<PostDocument>,
    @InjectModel(User.name) private usersModel: Model<UserDocument>,
  ) {}

  async getAllPosts(userId?: string | undefined): Promise<Post[]> {
    try {
      return await this.postsModel
        .find(userId ? { author: ObjectId(userId) } : {})
        .populate({ path: 'author', select: 'username email' })
        .populate({
          path: 'comments',
          select: 'author text',
          populate: {
            path: 'author',
            select: 'username email',
          },
        })
        .exec();
    } catch (e) {
      throw new HttpException('Posts no found', HttpStatus.NOT_FOUND);
    }
  }

  async getPost(id: string): Promise<Post> {
    try {
      return await this.postsModel
        .findById(id)
        .populate({ path: 'author', select: 'username email' })
        .exec();
    } catch (e) {
      throw new HttpException('Post no found', HttpStatus.NOT_FOUND);
    }
  }

  async createPost(
    postDto: CreatePostDto,
    userId: string,
  ): Promise<Post | undefined> {
    try {
      console.log(postDto);
      console.log(userId);
      if (userId) {
        const post = await this.postsModel.create({
          ...postDto,
          author: ObjectId(userId),
        });

        await this.usersModel.findByIdAndUpdate(ObjectId(userId), {
          $push: { posts: post._id },
        });

        return await post
          .populate({ path: 'author', select: 'username email' })
          .execPopulate();
      }
    } catch (e) {
      throw new HttpException('Add post error', HttpStatus.NOT_FOUND);
    }
  }

  async removePost(postId: string, userId: string): Promise<Post> {
    try {
      const post = await this.postsModel
        .findById(postId)
        .populate('author')
        .exec();
      await post.remove();

      await this.usersModel.findByIdAndUpdate(userId, {
        $pull: { posts: post._id },
      });

      return post;
    } catch (e) {
      throw new HttpException('Remove post error', HttpStatus.NOT_FOUND);
    }
  }

  async updatePost(postId: string, postDto: UpdatePostDto): Promise<Post> {
    try {
      const post = await this.postsModel
        .findById(postId)
        .populate('author')
        .exec();

      await post.update({ ...postDto });

      return post;
    } catch (e) {
      throw new HttpException('Update post error', HttpStatus.NOT_FOUND);
    }
  }
}
