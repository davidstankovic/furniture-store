import { Controller } from "@nestjs/common";
import { CategoryService } from "src/services/category/category.service";
import { Crud } from "@nestjsx/crud";
import { Category } from "entities/category.entity";

@Controller('api/category')
@Crud({
    model: { type: Category },
    params: {
        id: { field: 'categoryId', type: 'number', primary: true }
    },
    query: {
        join: {
            categories: { eager: true },
            parentCategory: { eager: true },
            furnitures: { eager: true }
        },
    },
})
export class ApiCategoryController {
    constructor(public service: CategoryService) { }
}
