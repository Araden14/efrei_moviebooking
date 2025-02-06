"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationsModule = void 0;
const common_1 = require("@nestjs/common");
const reservations_service_1 = require("./reservations.service");
const reservations_controller_1 = require("./reservations.controller");
const reservations_entity_1 = require("./entities/reservations.entity");
const typeorm_1 = require("@nestjs/typeorm");
const reservations_users_entity_1 = require("./entities/reservations_users.entity");
const movie_entity_1 = require("../movies/entities/movie.entity");
let ReservationsModule = class ReservationsModule {
};
exports.ReservationsModule = ReservationsModule;
exports.ReservationsModule = ReservationsModule = __decorate([
    (0, common_1.Module)({
        controllers: [reservations_controller_1.ReservationsController],
        providers: [reservations_service_1.ReservationsService],
        exports: [reservations_service_1.ReservationsService],
        imports: [typeorm_1.TypeOrmModule.forFeature([reservations_entity_1.Reservation, reservations_users_entity_1.ReservationUser, movie_entity_1.Movie])],
    })
], ReservationsModule);
//# sourceMappingURL=reservations.module.js.map