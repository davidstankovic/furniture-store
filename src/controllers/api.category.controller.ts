import { Controller, UseGuards } from "@nestjs/common";
import { CategoryService } from "src/services/category/category.service";
import { Crud } from "@nestjsx/crud";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { Category } from "src/entities/category.entity";


@Controller('api/category')
@Crud({
    model: { type: Category },
    params: {
        id: { field: 'categoryId', type: 'number', primary: true }
    },
    query: {
        join: {
            categories: { eager: true },
            parentCategory: { eager: false },
            furnitures: { eager: false },
            features: {
                eager: true
            }
        },
    },
    routes: {
        only: [
            "createOneBase",
            "createManyBase",
            "updateOneBase",
            "getManyBase",
            "getOneBase",
        ],
        getOneBase: {
            decorators: [
            ]
        },
        getManyBase: {
            decorators: [
            ]
        },
        createOneBase: {
            decorators: [
            ]
        },
        updateOneBase: {
            decorators: [
            ]
        },
    }
})

export class ApiCategoryController {
    constructor(public service: CategoryService) { }
}
