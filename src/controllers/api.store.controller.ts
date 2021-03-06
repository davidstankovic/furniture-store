// import { StoreService } from "src/services/store/store.service";
// import { Controller, UseGuards, Get, Param } from "@nestjs/common";
// import { Crud } from "@nestjsx/crud";
// import { Store } from "src/entities/store.entity";
// import { RoleCheckerGuard } from "src/misc/role.checker.guard";
// import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";

// @Controller('api/store')
// @Crud({
//     model: { type: Store },
//     params: { id: { field: 'storeId', type: 'number', primary: true } },
//     query: {
//         join: {
//             // category: { eager: true },
//             // furniturePrices: { eager: false },
//             // photos: { eager: true },
//             // availabilities: {eager: true},
//             // stores: {eager: true}
//             furnitures: {
//                 eager: true
//             },
//             availabilities: {
//                 eager: false
//             }
//         }
//     },
//     routes: {
//         only: [
//             "getManyBase",
//             "getOneBase",
//         ],
//         getManyBase: {
//             decorators: [
//             ]
//         },
//         getOneBase: {
//             decorators: [
//             ]
//         },
//     }
// })
// export class ApiStoreController {
//     constructor(public service: StoreService) { }
// }
