import { FurnitureService } from "src/services/furniture/furniture.service";
import { Controller, Post, Body } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Furniture } from "entities/furniture.entity";
import { AddFurnitureDto } from "dtos/furniture/add.furniture.dto";

@Controller('api/furniture')
@Crud({
    model: { type: Furniture },
    params: { id: { field: 'furnitureId', type: 'number', primary: true } },
    query: {
        join: {
            category: { eager: true },
            furniturePrices: { eager: false },
            photos: { eager: true },
            availabilities: {eager: true},
            stores: {eager: true}
        }
    }
})
export class ApiFurnitureController {
    constructor(public service: FurnitureService) { }

    @Post('createFull')
    createFullFurniture(@Body() data: AddFurnitureDto){
        return this.service.createFullFurniture(data);
    }
}
