import * as Validator from 'class-validator';
import { FurnitureSearchStoreComponentDto } from './furniture.search.store.component.dto';
import { FurnitureSearchFeatureComponentDto } from './furniture.search.feature.component.dto';
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
    @Validator.Length(0, 128)
    keywords: string;

    @Validator.IsOptional()
    @Validator.IsPositive()
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

    stores: FurnitureSearchStoreComponentDto[];

    features: FurnitureSearchFeatureComponentDto[];
    
    @Validator.IsOptional()
    @Validator.IsIn(['name', 'price'])
    orderBy: 'name' | 'price';

    @Validator.IsOptional()
    @Validator.IsIn(['ASC', 'DESC'])
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