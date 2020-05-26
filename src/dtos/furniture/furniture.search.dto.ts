import * as Validator from 'class-validator';
import { FurnitureSearchStoreComponentDto } from './furniture.search.store.component.dto';
export class FurnitureSearchDto {


    @Validator.IsNotEmpty()
    @Validator.IsPositive()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0
    })
    categoryId: number;

    @Validator.IsOptional()
    @Validator.IsString()
    @Validator.Length(2, 128)
    keywords: string;

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    priceMin: number;

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    priceMax: number;

   

    @Validator.IsOptional()
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3,32)
    color: string;


    @Validator.IsOptional()
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3,32)
    material: string;

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    width: number;
    
    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    height: number;

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 2
    })
    deep: number;

    stores: FurnitureSearchStoreComponentDto[];
    
    @Validator.IsOptional()
    @Validator.IsIn(['name', 'price'])
    orderBy: 'name' | 'price';
    orderDirection: 'ASC' | 'DESC';

    @Validator.IsOptional()
    @Validator.IsNumber({
        allowInfinity: false,
        allowNaN: false,
        maxDecimalPlaces: 0
    })
    @Validator.IsPositive()
    page: number;

    @Validator.IsOptional()
    @Validator.IsIn([5, 10, 25, 50])
    itemsPerPage: 5 | 10 | 25 | 50;
}
