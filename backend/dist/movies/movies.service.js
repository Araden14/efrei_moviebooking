"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const common_1 = require("@nestjs/common");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
let MoviesService = class MoviesService {
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
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = __decorate([
    (0, common_1.Injectable)()
], MoviesService);
//# sourceMappingURL=movies.service.js.map