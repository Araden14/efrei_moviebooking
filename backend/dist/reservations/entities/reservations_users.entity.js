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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservationUser = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const reservations_entity_1 = require("./reservations.entity");
let ReservationUser = class ReservationUser {
};
exports.ReservationUser = ReservationUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ReservationUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => reservations_entity_1.Reservation, reservation => reservation.reservationsUsers),
    __metadata("design:type", reservations_entity_1.Reservation)
], ReservationUser.prototype, "reservation", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.reservationsUsers),
    __metadata("design:type", user_entity_1.User)
], ReservationUser.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReservationUser.prototype, "creneau", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReservationUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ReservationUser.prototype, "updatedAt", void 0);
exports.ReservationUser = ReservationUser = __decorate([
    (0, typeorm_1.Entity)('reservations_users')
], ReservationUser);
//# sourceMappingURL=reservations_users.entity.js.map