import {
    Body,
    Controller, Get,
} from '@nestjs/common';
import {
    UsersService, 
} from './users.service';

@Controller('item-manager/api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get('email')
    getUserByEmail(@Body('email') userEmail: string) {
        return this.usersService.getUserByEmail(userEmail);
    }
}
