import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { registerAuthDto, loginAuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{
    constructor(
        private prisma: PrismaService, 
        private jwt: JwtService,
        private config: ConfigService
    ) 
    {}
    async login(dto: loginAuthDto){
        const User = await this.prisma.users.findUnique({
            where:{
                email: dto.email
            }
        });
        if(!User){
            throw new ForbiddenException('User not found');
        }
        const isPasswordValid = await argon.verify(User.hash_password, dto.password);
        if (!isPasswordValid){
            throw new ForbiddenException('Invalid password');
        }
        return this.signToken(User.id, User.email);
    }
    async register(dto: registerAuthDto){
        try{
            const hashedPassword = await argon.hash(dto.password);
            const User = await this.prisma.users.create({
                data:{
                    username: dto.username,
                    email: dto.email,
                    hash_password: hashedPassword,
                    phonenumber: dto.phonenumber
                }
            });
            delete User.hash_password;
            return User;
        }catch(err){
            if(err instanceof PrismaClientKnownRequestError){
                if(err.code === 'P2002'){
                    throw new ForbiddenException('User already exists');
                }
            }
            throw err;
        }
    }
    async signToken( userId: number, email: string ): Promise<{ access_token: string }>{
        const payload = {
            sub: userId,
            email: email
        }
        const secret = this.config.get('JWT_SECRET');
        const token=await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        });
        return{
            access_token: token
        }
    }
}