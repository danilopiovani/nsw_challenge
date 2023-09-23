"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchHelper = void 0;
// import fetch from 'node-fetch';
const fetch = require('node-fetch');
const fetchHelper = (endpoint) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield fetch(endpoint, {
            method: "GET"
        });
        if (!response.ok) {
            throw new Error(response.status.toString());
        }
        const data = yield response.json();
        // Throw an error if the response contains an error
        if (data === null || data === void 0 ? void 0 : data.error) {
            throw new Error(data.error.message);
        }
        return { data, errors: null };
    }
    catch (error) {
        return { data: null, errors: error.message };
    }
});
exports.fetchHelper = fetchHelper;
