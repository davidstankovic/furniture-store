import { Controller, UseGuards } from "@nestjs/common";
import { CategoryService } from "src/services/category/category.service";
import { Crud } from "@nestjsx/crud";
import { Category } from "src/entities/category.entity";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

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
    routes: {
        only: [
            "createOneBase",
            "createManyBase",
            "updateOneBase",
            "getManyBase",
            "getOneBase",
        ],
        createOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator'),
            ]
        },
        createManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator'),
            ]
        },
        updateOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator'),
            ]
        },
        getManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator'),
            ]
        },
        getOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator'),
            ]
        },
    }
})
export class ApiCategoryController {
    constructor(public service: CategoryService) { }
}
