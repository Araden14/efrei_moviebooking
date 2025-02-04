import { Controller, Get, Post, Body, Patch, Param, Delete, Query, BadRequestException, HttpException, InternalServerErrorException } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';

const allowedSortBy = [
  "annee.desc",
  "annee.asc"
];

@ApiTags('Films')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer la liste des films', description: 'Retourne une liste paginée de films avec possibilité de recherche et de tri' })
  @ApiQuery({ name: 'search', required: false, description: 'Terme de recherche pour filtrer les films' })
  @ApiQuery({ name: 'page', required: false, description: 'Numéro de la page à afficher (optionnel)' })
  @ApiQuery({ name: 'sort_by', required: false, description: 'Critère de tri des résultats (optionnel)', enum: allowedSortBy })
  @ApiResponse({ status: 200, description: 'Liste des films récupérée avec succès' })
  @ApiResponse({ status: 400, description: 'Paramètre de tri invalide' })
  async fetchMovies(@Query('search') search: string, @Query('page') page: number, @Query('sort_by') sortBy: string) {
    if (sortBy && !allowedSortBy.includes(sortBy)) {
      throw new BadRequestException('Invalid sortBy parameter');
    }
    try {
      return await this.moviesService.fetchMovies(search, page, sortBy);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch movies');
    }
  }
}
