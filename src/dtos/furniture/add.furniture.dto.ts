import * as Validator from 'class-validator';
import { FurnitureStoreComponentDto } from './furniture.store.component.dto';
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
    @Validator.IsString()
    @Validator.Length(10,128)
    construction: string;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3,32)
    color: string;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 2,
    })
    height: number;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    width: number;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    deep: number;

    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3,32)
    material: string;

    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2,
    })
    price: number;

    @Validator.IsArray()
    @Validator.ValidateNested({
        always: true,
    })
    stores: FurnitureStoreComponentDto[];
}