export class EditFurnitureDto {
    name: string;
    categoryId: number;
    description: string;
    status: 'available' | 'visible'| 'hidden';
    construction: string;
    color: string;
    height: number;
    width: number;
    deep: number;
    material: string;
    price: number;
    stores: {
        storeId: number;
        isAvailable: 0 | 1;
    }[] | null;
}