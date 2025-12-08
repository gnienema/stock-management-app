// stock-api/src/statistique/statistique.controller.ts

import { Controller, Get } from '@nestjs/common';
import { StatistiqueService } from './statistique.service';

@Controller('stats') // <== Le préfixe de route doit être 'stats'
export class StatistiqueController {
  constructor(private readonly statistiqueService: StatistiqueService) {}

  @Get('dashboard') // <== Le chemin complet sera donc /stats/dashboard
  getDashboardStats() {
    // Cette fonction doit retourner quelque chose (même un objet vide pour l'instant)
    return this.statistiqueService.getDashboardStats();
  }
  
  // Assurez-vous que cette méthode existe et qu'elle retourne quelque chose
}