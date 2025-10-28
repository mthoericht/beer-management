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
exports.Beer = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const beerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    brewery: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    style: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    abv: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    notes: {
        type: String,
        trim: true,
        maxlength: 500,
        default: ''
    },
    drank: {
        type: Boolean,
        default: false
    },
    dateAdded: {
        type: Date,
        default: Date.now
    },
    dateDrank: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});
beerSchema.index({ name: 1, brewery: 1 });
beerSchema.index({ style: 1 });
beerSchema.index({ drank: 1 });
beerSchema.index({ dateAdded: -1 });
exports.Beer = mongoose_1.default.model('Beer', beerSchema);
//# sourceMappingURL=Beer.js.map