export interface IProduct{
    name: string;
    description: string;
    category: string;
    subCategory?: string;
    productMRP: number;
    discount:number
    productSP:number
    quantity: number;
    sku: string;
    images: [string]
    dateAdded?: Date;
    status: 'available' | 'out of stock' | 'discontinued';
    tags: string[];
    wattage:number
    colorTemperature:number
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
    weight?: number;
    colorVariants:[string]
}