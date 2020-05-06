import { StoreService } from "src/services/store/store.service";
import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Store } from "entities/store.entity";

@Controller('api/store')
@Crud({
    model: { type: Store },
    params: { id: { field: 'storeId', type: 'number', primary: true } },
    query: {
        join: {
            // category: { eager: true },
            // furniturePrices: { eager: false },
            // photos: { eager: true },
            // availabilities: {eager: true},
            // stores: {eager: true}
            furnitures: {
                eager: true
            }
        }
    }
})
export class ApiStoreController {
    constructor(public service: StoreService) { }
}
