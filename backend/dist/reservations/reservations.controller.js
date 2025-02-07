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
exports.ReservationsController = void 0;
const common_1 = require("@nestjs/common");
const reservations_service_1 = require("./reservations.service");
const reservations_dto_1 = require("./dto/reservations.dto");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../users/get-user-decorator");
const swagger_1 = require("@nestjs/swagger");
let ReservationsController = class ReservationsController {
    constructor(reservationsService) {
        this.reservationsService = reservationsService;
    }
    createReservation(user, reservation) {
        return this.reservationsService.create(user, reservation);
    }
    findAll(user) {
        return this.reservationsService.findAll(user);
    }
    delete(usereservationid, user) {
        return this.reservationsService.delete(user, usereservationid);
    }
    creneauxList() {
        return this.reservationsService.CreneauxList();
    }
};
exports.ReservationsController = ReservationsController;
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une nouvelle réservation' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'La réservation a été créée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Requête invalide - Les données fournies sont incorrectes.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé - Authentification requise.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Erreur serveur - Une erreur est survenue lors de la création.' }),
    (0, swagger_1.ApiBody)({ schema: { type: 'object', properties: { reservationid: { type: 'number' }, creneau: { type: 'number' } } } }),
    (0, common_1.Post)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, reservations_dto_1.ReservationDto]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "createReservation", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les réservations de l\'utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des réservations récupérée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé - Authentification requise.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Erreur serveur - Une erreur est survenue lors de la récupération.' }),
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: "Supprimer une réservation en tant qu'utilisateur" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des réservations récupérée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non autorisé - Authentification requise.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Erreur serveur - Une erreur est survenue lors de la récupération.' }),
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "delete", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer tous les créneaux' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste de toutes les réservations récupérée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Erreur serveur - Une erreur est survenue lors de la récupération.' }),
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReservationsController.prototype, "creneauxList", null);
exports.ReservationsController = ReservationsController = __decorate([
    (0, swagger_1.ApiTags)('Réservations'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('reservations'),
    __metadata("design:paramtypes", [reservations_service_1.ReservationsService])
], ReservationsController);
//# sourceMappingURL=reservations.controller.js.map