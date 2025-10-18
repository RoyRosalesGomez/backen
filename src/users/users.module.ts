import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  ActivityModule,
],
  
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}