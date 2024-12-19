import { IsEmail,IsNotEmpty, IsString } from 'class-validator';

export class registerAuthDto{

    @IsString()
    @IsNotEmpty()
    username: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    phonenumber: string;
}