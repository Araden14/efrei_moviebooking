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
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
const movie_entity_1 = require("./entities/movie.entity");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
(0, dotenv_1.config)();
let MoviesService = class MoviesService {
    constructor(moviesRepository) {
        this.moviesRepository = moviesRepository;
    }
    async fetchMovies(search, page, sortBy) {
        let url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}`;
        if (search) {
            url += `&query=${search}`;
        }
        if (page) {
            url += `&page=${page}`;
        }
        const response = await fetch(url, {
            headers: {
                'accept': 'application/json'
            }
        });
        const data = await response.json();
        if (sortBy === "annee.desc") {
            data.results.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        }
        if (sortBy === "annee.asc") {
            data.results.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        }
        return data;
    }
    async fetchAvailableMovies() {
        return await this.moviesRepository.find();
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], MoviesService);
//# sourceMappingURL=movies.service.js.map