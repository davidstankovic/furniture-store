import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Furniture } from "entities/furniture.entity";
import { AddFurnitureDto } from "dtos/furniture/add.furniture.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { FurniturePrice } from "entities/furniture-price.entity";
import { Availability } from "entities/availability.entity";

@Injectable()
export class FurnitureService extends TypeOrmCrudService<Furniture> {
    constructor(
        @InjectRepository(Furniture) private readonly furniture: Repository<Furniture>,

        @InjectRepository(FurniturePrice)
        private readonly furniturePrice: Repository<FurniturePrice>,

        @InjectRepository(Availability)
        private readonly availability: Repository<Availability>
        ) {
        super(furniture);
    }

    async createFullFurniture(data: AddFurnitureDto): Promise<Furniture | ApiResponse> {
        let newFurniture: Furniture = new Furniture();
        newFurniture.name = data.name;
        newFurniture.categoryId = data.categoryId;
        newFurniture.description = data.description;
        newFurniture.construction = data.construction;
        newFurniture.color = data.color;
        newFurniture.height = data.height;
        newFurniture.width = data.width;
        newFurniture.deep = data.deep;
        newFurniture.material = data.material;

        let savedFurniture = await this.furniture.save(newFurniture);

        let newFurniturePrice: FurniturePrice = new FurniturePrice();
        newFurniturePrice.furnitureId = savedFurniture.furnitureId;
        newFurniturePrice.price = data.price;

        await this.furniturePrice.save(newFurniturePrice);

        for (let store of data.stores){
            let newAvailability: Availability = new Availability();
            newAvailability.furnitureId = savedFurniture.furnitureId;
            newAvailability.storeId = store.storeId;
            newAvailability.isAvailable = store.isAvailable;

            await this.availability.save(newAvailability);
        }

        return await this.furniture.findOne(savedFurniture.furnitureId, {
            relations: [
                "category",
                "availabilities",
                "stores",
                "furniturePrices"
            ]
        })
    }
}
