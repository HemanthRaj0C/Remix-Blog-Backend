import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateBlogDto) {
    const blog = await this.prisma.blog.create({
      data: {
        ...dto,
        authorId: userId,
      },
    });
    return blog;
  }

  async findAll() {
    return this.prisma.blog.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    const blog = await this.prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    return blog;
  }

  async update(id: number, userId: number, dto: UpdateBlogDto) {
    // First, get the blog
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });

    // Check if blog exists
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    // Check if user is the author
    if (blog.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.blog.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number, userId: number) {
    // First, get the blog
    const blog = await this.prisma.blog.findUnique({
      where: { id },
    });

    // Check if blog exists
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    // Check if user is the author
    if (blog.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.blog.delete({
      where: { id },
    });
  }

  async findUserBlogs(userId: number) {
    return this.prisma.blog.findMany({
      where: { authorId: userId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}