import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { loginAuthDto, registerAuthDto } from "./dto";


@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService) {}

    @Post('login')
    login(@Body() dto:loginAuthDto ){
        return this.authService.login(dto);
    }

    @Post('register')
    register(@Body() dto:registerAuthDto){
        return this.authService.register(dto);
    }
}