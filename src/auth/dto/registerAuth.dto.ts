import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class registerAuthDto {

    @IsString()
    @IsOptional()
    username?: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}