import { Controller, UseGuards, Get, Param } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Feature } from "src/entities/feature.entity";
import { FeatureService } from "src/services/feature/feature.service";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";
import DistinctFeatureValuesDto from "src/dtos/feature/distinct.feature.values.dto";

@Controller('api/feature')
@Crud({
    model: {
        type: Feature
    },
    params: {
        id: {
            field: 'featureId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            category: {
                eager: true
            },
            furnitureFeatures: {
                eager: false
            },
            furnitures: {
                eager: false
            }
        }
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
            ],
        },
        createManyBase: {
            decorators: [
            ],
        },
        updateOneBase: {
            decorators: [
            ],
        },
        getManyBase: {
            decorators: [
            ],
        },
        getOneBase: {
            decorators: [
            ],
        },
    },
})
export class FeatureController {
    constructor(public service: FeatureService) { }

    @Get('values/:categoryId')
    async getDistinctValuesByCategoryId(@Param('categoryId') categoryId: number): Promise<DistinctFeatureValuesDto>{
        return await this.service.getDistinctValuesByCategoryId(categoryId);
    }

}
