import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class registerAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    name?: string;
}