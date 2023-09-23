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
const AddressApi_1 = require("../lambda/AddressApi/");
const createMockEvent_1 = require("./utils/createMockEvent");
describe('handler', () => {
    it('should return a successful response', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mocking the event object with your test data
        const event = (0, createMockEvent_1.createMockEvent)('59+MOBBS+LANE+EPPING');
        // Invoking the Lambda function
        const result = yield (0, AddressApi_1.handler)(event);
        // Performing assertions on the result
        expect(result.statusCode).toBe(200);
        expect(typeof result.body).toBe('string');
    }));
    it('should handle errors and return an error response - LOCATION NOT FOUND', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mocking the event object with an error condition (location not found)
        const event = (0, createMockEvent_1.createMockEvent)('9+MOBBS+LANE+EPPING');
        // Invoking the Lambda function
        const result = yield (0, AddressApi_1.handler)(event);
        // Performing assertions on the error response
        expect(result.statusCode).toBe(500);
        expect(typeof result.body).toBe('string');
        expect(result.body).toContain('error');
    }));
    it('should handle errors and return an error response - API REQUEST ERROR', () => __awaiter(void 0, void 0, void 0, function* () {
        // Mocking the event object with an error condition (API error)
        const event = (0, createMockEvent_1.createMockEvent)('%279+MOBBS+LANE+EPPING');
        // Invoking the Lambda function
        const result = yield (0, AddressApi_1.handler)(event);
        // Performing assertions on the error response
        expect(result.statusCode).toBe(500);
        expect(typeof result.body).toBe('string');
        expect(result.body).toContain('error');
    }));
});
