import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthService} from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtStrategy } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    checkData(@Body() body: CreateUserDto){
      return this.authService.checkdata(body);
    }

     @Post('login')
    loginData(@Body() body: LoginDto){
      return this.authService.loginData(body);
    }

    @Get('users') 
    getAllData() {
        return this.authService.getAllData()
    }

    @Get('profile/:id')
    getprofile(@Param('id') id: string) {
        
        return this.authService.getprofile(id)
    }

     @UseGuards(JwtStrategy)
    @Get('me')
    getCurrentUser(@CurrentUser() user: any) {
        return user;
    }


    @UseGuards(JwtStrategy)
    @Get('profile')
    getProfile(@CurrentUser() user: any) {
        return {
            message: 'This is a protected route',
            user: user,
        };
    }


    @UseGuards(JwtStrategy)
    @Get('profile/:id')
    getUserProfile(@Param('id') id: string) {
        return this.authService.getprofile(id);
    }
}
