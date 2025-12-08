// stock-api/src/emplacement/emplacement.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Emplacement } from './entities/emplacement.entity';
import { CreateEmplacementDto, UpdateEmplacementDto } from './dto/emplacement.dto';

@Injectable()
export class EmplacementService {
  constructor(
    @InjectRepository(Emplacement)
    private emplacementsRepository: Repository<Emplacement>,
  ) {}

  async findAll(): Promise<Emplacement[]> {
    // Récupérer tous les emplacements
    return this.emplacementsRepository.find();
  }

  async findOne(id: number): Promise<Emplacement> {
    const emplacement = await this.emplacementsRepository.findOne({ where: { id } });
    if (!emplacement) {
      throw new NotFoundException(`Emplacement avec l'ID ${id} non trouvé`);
    }
    return emplacement;
  }


// Ligne 29: La fonction doit retourner UNE SEULE Promesse d'Emplacement.
async create(createEmplacementDto: CreateEmplacementDto): Promise<Emplacement> { 
    const newEmplacement = this.emplacementsRepository.create(createEmplacementDto);
    return this.emplacementsRepository.save(newEmplacement);
}

  async update(id: number, updateEmplacementDto: UpdateEmplacementDto): Promise<Emplacement> {
    const emplacement = await this.findOne(id);
    this.emplacementsRepository.merge(emplacement, updateEmplacementDto);
    return this.emplacementsRepository.save(emplacement);
  }

  async remove(id: number): Promise<void> {
    const result = await this.emplacementsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Emplacement avec l'ID ${id} non trouvé`);
    }
  }
}