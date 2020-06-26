import * as Validator from 'class-validator';
// import { FurnitureStoreComponentDto } from './furniture.store.component.dto';
import { FurnitureFeatureComponentDto } from './furniture.feature.component.dto';
export class AddFurnitureDto {
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3,128)
    name: string;

    categoryId: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(64, 10000)
    description: string;
    
    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    price: number;

    // @Validator.IsArray()
    // @Validator.ValidateNested({
    //     always: true,
    // })
    // stores: FurnitureStoreComponentDto[];

    @Validator.IsArray()
    @Validator.ValidateNested({
        always: true,
    })
    features: FurnitureFeatureComponentDto[];
}