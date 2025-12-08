// stock-api/src/emplacement/emplacement.controller.ts

import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EmplacementService } from './emplacement.service';
import { Emplacement } from './entities/emplacement.entity';
import { CreateEmplacementDto, UpdateEmplacementDto } from './dto/emplacement.dto';

@Controller('emplacements')
export class EmplacementController {
  constructor(private readonly emplacementService: EmplacementService) {}

  @Get()
  findAll(): Promise<Emplacement[]> {
    return this.emplacementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Emplacement> {
    return this.emplacementService.findOne(id);
  }

  @Post()
  create(@Body() createEmplacementDto: CreateEmplacementDto): Promise<Emplacement> {
    return this.emplacementService.create(createEmplacementDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmplacementDto: UpdateEmplacementDto,
  ): Promise<Emplacement> {
    return this.emplacementService.update(id, updateEmplacementDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.emplacementService.remove(id);
  }
}