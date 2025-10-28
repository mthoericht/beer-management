import { Document } from 'mongoose';
export interface IBeer extends Document {
    name: string;
    brewery: string;
    style: string;
    abv: number;
    rating?: number;
    notes?: string;
    drank: boolean;
    dateAdded: Date;
    dateDrank?: Date;
}
export interface IApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
export interface IBeerStats {
    totalBeers: number;
    drankBeers: number;
    pendingBeers: number;
    ratedBeers: number;
    averageRating: number;
    topStyle?: {
        style: string;
        count: number;
    };
    topBrewery?: {
        brewery: string;
        count: number;
    };
}
//# sourceMappingURL=index.d.ts.map