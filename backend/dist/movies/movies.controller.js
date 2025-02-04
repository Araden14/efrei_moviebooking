"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesController = void 0;
const common_1 = require("@nestjs/common");
const movies_service_1 = require("./movies.service");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const common_2 = require("@nestjs/common");
const allowedSortBy = [
    "annee.desc",
    "annee.asc"
];
let MoviesController = class MoviesController {
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    async fetchMovies(search, page, sortBy) {
        if (sortBy && !allowedSortBy.includes(sortBy)) {
            throw new common_1.BadRequestException('Invalid sortBy parameter');
        }
        try {
            return await this.moviesService.fetchMovies(search, page, sortBy);
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Failed to fetch movies');
        }
    }
};
exports.MoviesController = MoviesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_2.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer la liste des films', description: 'Retourne une liste paginée de films avec possibilité de recherche et de tri' }),
    (0, swagger_1.ApiQuery)({ name: 'search', required: false, description: 'Terme de recherche pour filtrer les films' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Numéro de la page à afficher (optionnel)' }),
    (0, swagger_1.ApiQuery)({ name: 'sort_by', required: false, description: 'Critère de tri des résultats (optionnel)', enum: allowedSortBy }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des films récupérée avec succès' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Paramètre de tri invalide' }),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('sort_by')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], MoviesController.prototype, "fetchMovies", null);
exports.MoviesController = MoviesController = __decorate([
    (0, swagger_1.ApiTags)('Films'),
    (0, common_1.Controller)('movies'),
    __metadata("design:paramtypes", [movies_service_1.MoviesService])
], MoviesController);
//# sourceMappingURL=movies.controller.js.map