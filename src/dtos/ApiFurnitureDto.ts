export default interface ApiFurnitureDto{
    furnitureId: number;
    name: string;
    categoryId: number;
    description: string;
    status: "available" | "visible" | "hidden";
    furniturePrices: {
        furniturePriceId: number;
        price: number;
    }[];
    photos: {
        photoId: number;
        imagePath: string;
    }[];
    furnitureFeatures: {
        furnitureFeatureId: number;
        featureId: number;
        value: string;
    }[];
    features: {
        featureId: number;
        name: string;
    }[];
    category?: {
        name: string;
    }

}