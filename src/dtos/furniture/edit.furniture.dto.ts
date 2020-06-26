import * as Validator from 'class-validator';
// import { FurnitureStoreComponentDto } from './furniture.store.component.dto';
import { FurnitureStatus } from 'src/types/furniture.status.enum';
import { FurnitureFeatureComponentDto } from "./furniture.feature.component.dto";
export class EditFurnitureDto {
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
    @Validator.IsString()
    @Validator.IsEnum(FurnitureStatus)
    status: 'available' | 'visible'| 'hidden';

    
    @Validator.IsNotEmpty()
    @Validator.IsIn([0, 1])
    availableOne: 0 | 1;

    
    @Validator.IsNotEmpty()
    @Validator.IsIn([0, 1])
    availableTwo: 0 | 1;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    price: number;

    // @Validator.IsOptional()
    // @Validator.IsArray()
    // @Validator.ValidateNested({
    //     always: true,
    // })
    // stores: FurnitureStoreComponentDto[] | null;
    
    @Validator.IsOptional()
    @Validator.IsArray()
    @Validator.ValidateNested({
        always: true,
    })
    features: FurnitureFeatureComponentDto[] | null;
}