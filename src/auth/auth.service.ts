import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { registerAuthDto, loginAuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) {}

    async login(dto: loginAuthDto) {
        try {
            // Find the user
            const user = await this.prisma.user.findUnique({
                where: {
                    email: dto.email,
                },
            });

            // If user doesn't exist throw exception
            if (!user) {
                throw new ForbiddenException('Credentials incorrect');
            }

            // Verify password
            const passwordMatches = await argon.verify(
                user.password,
                dto.password
            );

            if (!passwordMatches) {
                throw new ForbiddenException('Credentials incorrect');
            }

            // Return token
            return this.signToken(user.id, user.email);
        } catch (error) {
            throw error;
        }
    }

    async register(dto: registerAuthDto) {
        try {
            // Hash password
            const hashedPassword = await argon.hash(dto.password);

            // Create user
            const user = await this.prisma.user.create({
                data: {
                    username: dto.username,
                    email: dto.email,
                    password: hashedPassword,
                },
            });

            // Return token
            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Email already exists');
                }
            }
            throw error;
        }
    }

    private async signToken(
        id: number,
        email: string
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: id,
            email,
        };

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '1h',
            secret: secret,
        });

        return {
            access_token: token,
        };
    }
}