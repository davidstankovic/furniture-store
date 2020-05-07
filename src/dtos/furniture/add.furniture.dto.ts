export class AddFurnitureDto {
    name: string;
    categoryId: number;
    description: string;
    construction: string;
    color: string;
    height: number;
    width: number;
    deep: number;
    material: string;
    price: number;
    stores: {
        storeId: number;
        isAvailable: number;
    }[]
}