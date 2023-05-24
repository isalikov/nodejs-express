"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var NotFound_1 = require("../middlewares/NotFound");
var routes = (0, express_1.Router)();
routes.use('*', NotFound_1.default);
exports.default = routes;
