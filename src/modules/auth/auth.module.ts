import {forwardRef, Module} from '@nestjs/common';
import { AuthController }   from './auth.controller';
import { AuthService }      from './auth.service';
import {UsersModule}        from "../users/users.module";
import {JwtModule}          from "@nestjs/jwt";
import { PostsModule }      from '../posts/posts.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
      forwardRef(() => UsersModule),
      forwardRef(() => PostsModule),
      JwtModule.register({
        secret: process.env.PRIVATE_KEY || 'SECRET',
        signOptions: {
          expiresIn: '24h'
        }
      })
  ],
    exports: [
        AuthService,
        JwtModule
    ]
})
export class AuthModule {}
