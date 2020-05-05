import { FurnitureService } from "src/services/furniture/furniture.service";
import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Furniture } from "entities/furniture.entity";

@Controller('api/furniture')
@Crud({
    model: { type: Furniture },
    params: { id: { field: 'furnitureId', type: 'number', primary: true } },
    query: {
        join: {
            category: { eager: true },
            furniturePrices: { eager: false },
            photos: { eager: true },
        }
    }
})
export class ApiFurnitureController {
    constructor(public service: FurnitureService) { }
}
