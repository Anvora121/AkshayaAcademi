"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlacementOffer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PlacementOfferSchema = new mongoose_1.Schema({
    universityId: { type: String, required: true },
    universityName: { type: String, required: true },
    country: { type: String, required: true },
    companyName: { type: String, required: true },
    role: { type: String, required: true },
    offerType: {
        type: String,
        enum: ['intern', 'full-time'],
        required: true,
    },
    ctcMin: { type: Number, required: true, min: 0 },
    ctcMax: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'USD' },
    location: { type: String, required: true },
    batchYear: { type: Number, required: true, min: 2000, max: 2100 },
}, { timestamps: true });
// Indexes for filtering and aggregation
PlacementOfferSchema.index({ universityId: 1 });
PlacementOfferSchema.index({ country: 1 });
PlacementOfferSchema.index({ companyName: 1 });
PlacementOfferSchema.index({ batchYear: -1 });
exports.PlacementOffer = mongoose_1.default.model('PlacementOffer', PlacementOfferSchema);
