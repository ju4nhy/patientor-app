"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.HealthCheckRating = exports.EntryType = void 0;
var EntryType;
(function (EntryType) {
    EntryType[EntryType["Hospital"] = 0] = "Hospital";
    EntryType[EntryType["HealthCheck"] = 1] = "HealthCheck";
    EntryType[EntryType["OccupationalHealthcare"] = 2] = "OccupationalHealthcare";
})(EntryType = exports.EntryType || (exports.EntryType = {}));
var HealthCheckRating;
(function (HealthCheckRating) {
    HealthCheckRating[HealthCheckRating["Healthy"] = 0] = "Healthy";
    HealthCheckRating[HealthCheckRating["LowRisk"] = 1] = "LowRisk";
    HealthCheckRating[HealthCheckRating["HighRisk"] = 2] = "HighRisk";
    HealthCheckRating[HealthCheckRating["CriticalRisk"] = 3] = "CriticalRisk";
    HealthCheckRating[HealthCheckRating["DeathDanger"] = 4] = "DeathDanger";
})(HealthCheckRating = exports.HealthCheckRating || (exports.HealthCheckRating = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
    Gender["Other"] = "other";
})(Gender = exports.Gender || (exports.Gender = {}));
