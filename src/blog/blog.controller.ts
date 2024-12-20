import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  @UseGuards(JwtGuard)
  create(@Req() req, @Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(req.user.id, createBlogDto);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get('my-blogs')
  @UseGuards(JwtGuard)
  findUserBlogs(@Req() req) {
    return this.blogService.findUserBlogs(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  update(@Param('id') id: string, @Req() req, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(+id, req.user.id, updateBlogDto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  remove(@Param('id') id: string, @Req() req) {
    return this.blogService.remove(+id, req.user.id);
  }
}