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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reservations_entity_1 = require("./entities/reservations.entity");
const reservations_users_entity_1 = require("./entities/reservations_users.entity");
const typeorm_2 = require("typeorm");
const movie_entity_1 = require("../movies/entities/movie.entity");
const common_2 = require("@nestjs/common");
const creneauxHours = {
    4: '08:00',
    5: '10:00',
    6: '12:00',
    7: '14:00',
    8: '16:00',
    9: '18:00',
    10: '20:00',
    11: '22:00'
};
let ReservationsService = class ReservationsService {
    constructor(reservationsRepository, reservationsUserRepository, moviesRepository) {
        this.reservationsRepository = reservationsRepository;
        this.reservationsUserRepository = reservationsUserRepository;
        this.moviesRepository = moviesRepository;
    }
    async create(user, reservation) {
        try {
            const userid = user.id;
            const reservationid = reservation.reservationid;
            const reservationrow = await this.reservationsRepository.findOne({ where: { id: reservationid } });
            const movierow = await this.moviesRepository.findOne({ where: { id: reservationrow?.movieId } });
            if (!reservationrow || !movierow) {
                throw new common_2.BadRequestException("Erreur dans la récupération des données");
            }
            const creneaux = reservationrow.creneaux;
            const indice_creneau = creneaux.indexOf(reservation.creneau);
            const heure = creneauxHours[reservation.creneau].split(':')[0];
            const date = movierow.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
            if (indice_creneau === -1) {
                throw new common_2.BadRequestException("Le créneau demandé n'est pas disponible");
            }
            const now = new Date();
            if (movierow.date < now) {
                throw new common_2.BadRequestException("Impossible de réserver pour une séance passée");
            }
            const existingReservation = await this.reservationsUserRepository.findOne({
                where: {
                    reservation: { id: reservationid },
                    user: { id: userid },
                    creneau: creneaux[indice_creneau]
                }
            });
            if (existingReservation) {
                throw new common_2.BadRequestException("Vous avez déjà une réservation pour ce créneau");
            }
            await this.reservationsUserRepository
                .createQueryBuilder()
                .insert()
                .into(reservations_users_entity_1.ReservationUser)
                .values([
                { reservation: reservationrow, user: userid, creneau: creneaux[indice_creneau] },
            ])
                .execute();
            return { message: `Félicitations ! Nous confirmons votre réservation pour le film ${movierow.titre} à ${heure}h le ${date}` };
        }
        catch (error) {
            if (error instanceof common_2.BadRequestException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Une erreur est survenue lors de la réservation');
        }
    }
    async findAll(user) {
        const reservations = await this.reservationsUserRepository.find({
            where: { user: { id: user.id } },
            relations: ['reservation', 'user']
        });
        return reservations.map(reservation => ({
            id: reservation.id,
            reservationId: reservation.reservation.id,
            userId: reservation.user.id,
            creneau: reservation.creneau,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt
        }));
    }
    async delete(user, usereservationid) {
        if (!usereservationid) {
            throw new common_2.BadRequestException("Le numéro de réservation est requis");
        }
        const reservationrow = await this.reservationsUserRepository.findOne({
            where: { id: usereservationid },
            relations: ['user', 'reservation']
        });
        const movierow = await this.moviesRepository.findOne({ where: { id: reservationrow?.reservation.movieId } });
        if (!reservationrow || !movierow) {
            throw new common_2.BadRequestException("La réservation ou le film n'ont pas pu être identifiés");
        }
        const date = movierow.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
        const userid = user.id;
        if (reservationrow.user.id != user.id)
            throw new common_2.BadRequestException("Cette réservation a été effectuée par un autre utilisateur");
        try {
            await this.reservationsUserRepository
                .createQueryBuilder()
                .delete()
                .from(reservations_users_entity_1.ReservationUser)
                .where("id = :id", { id: usereservationid })
                .execute();
        }
        catch (error) {
            throw new common_1.InternalServerErrorException("Une erreur est survenue lors de la suppression de la réservation");
        }
        return `Votre reservation pour le film ${movierow.titre} le ${date} a bien été annulée`;
    }
    async CreneauxList() {
        const reservations = await this.reservationsRepository.find();
        return reservations.map(reservation => ({
            id: reservation.id,
            movieId: reservation.movieId,
            creneaux: reservation.creneaux,
            createdAt: reservation.createdAt,
            updatedAt: reservation.updatedAt,
        }));
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservations_entity_1.Reservation)),
    __param(1, (0, typeorm_1.InjectRepository)(reservations_users_entity_1.ReservationUser)),
    __param(2, (0, typeorm_1.InjectRepository)(movie_entity_1.Movie)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map