import * as Validator from 'class-validator';
export class FurnitureSearchStoreComponentDto {
    storeId: number;
    
    @Validator.IsArray()
    @Validator.IsNotEmpty({
        each: true
    })
    @Validator.IsIn([0,1], {
        each: true
    })
    isAvailable: number[];
}