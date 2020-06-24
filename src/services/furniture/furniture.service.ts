import { Injectable } from "@nestjs/common";
import { Repository, QueryBuilder, In } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Furniture } from "src/entities/furniture.entity";
import { AddFurnitureDto } from "src/dtos/furniture/add.furniture.dto";
import { EditFurnitureDto } from "src/dtos/furniture/edit.furniture.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { FurnitureFeature } from "src/entities/furniture-feature.entity";
import { FurniturePrice } from "src/entities/furniture-price.entity";
import { Availability } from "src/entities/availability.entity";
import { FurnitureSearchDto } from "src/dtos/furniture/furniture.search.dto";

@Injectable()
export class FurnitureService extends TypeOrmCrudService<Furniture> {
    constructor(
        @InjectRepository(Furniture) private readonly furniture: Repository<Furniture>,

        @InjectRepository(FurniturePrice)
        private readonly furniturePrice: Repository<FurniturePrice>,

        @InjectRepository(FurnitureFeature)
        private readonly furnitureFeature: Repository<FurnitureFeature>,

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

        let savedFurniture = await this.furniture.save(newFurniture);

        let newFurniturePrice: FurniturePrice = new FurniturePrice();
        newFurniturePrice.furnitureId = savedFurniture.furnitureId;
        newFurniturePrice.price = data.price;

        await this.furniturePrice.save(newFurniturePrice);

        // for (let store of data.stores){
        //     let newAvailability: Availability = new Availability();
        //     newAvailability.furnitureId = savedFurniture.furnitureId;
        //     newAvailability.storeId = store.storeId;
        //     newAvailability.isAvailable = store.isAvailable;

        //     await this.availability.save(newAvailability);
        // }

        for (let feature of data.features) {
            let newFurnitureFeature: FurnitureFeature = new FurnitureFeature();
            newFurnitureFeature.furnitureId = savedFurniture.furnitureId;
            newFurnitureFeature.featureId = feature.featureId;
            newFurnitureFeature.value     = feature.value;

            await this.furnitureFeature.save(newFurnitureFeature);
        }

        return await this.furniture.findOne(savedFurniture.furnitureId, {
            relations: [
                "category",
                "furnitureFeatures",
                "features",
                // "availabilities",
                // "stores",
                "furniturePrices",
                "photos"
            ]
        })
    }

    async editFullFurniture(furnitureId: number, data: EditFurnitureDto): Promise<Furniture | ApiResponse>{
        const existingFurniture: Furniture = await this.furniture.findOne(furnitureId, {
            relations: ['furniturePrices', 'furnitureFeatures']
        });

        if(!existingFurniture){
            return new ApiResponse('error', -5001, 'Furniture not found!');
        }

        existingFurniture.name = data.name;
        existingFurniture.categoryId = data.categoryId;
        existingFurniture.description = data.description;
        existingFurniture.status = data.status;

        const savedFurniture = await this.furniture.save(existingFurniture)
        if(!savedFurniture){
            return new ApiResponse('error', -5002, 'Could not save new furniture data!');
        }

        const newPriceString: string = Number(data.price).toFixed(2);
        const lastPrice = existingFurniture.furniturePrices[existingFurniture.furniturePrices.length - 1].price
        const lastPriceString: string = Number(lastPrice).toFixed(2);

        if(newPriceString !== lastPriceString){
            const newFurniturePrice = new FurniturePrice();
            newFurniturePrice.furnitureId = furnitureId;
            newFurniturePrice.price = data.price;

            const savedFurniturePrice = await this.furniturePrice.save(newFurniturePrice);

            if(!savedFurniturePrice){
                return new ApiResponse('error', -5003, 'Could not save the new furniture price!')
            }
        }

        // if(data.stores !== null){
        //     await this.availability.remove(existingFurniture.availabilities)
        //     for (let store of data.stores){
        //         let newAvailability: Availability = new Availability();
        //         newAvailability.furnitureId = furnitureId;
        //         newAvailability.storeId = store.storeId;
        //         newAvailability.isAvailable = store.isAvailable;
    
        //         await this.availability.save(newAvailability);
        //     }
        // }

        if (data.features !== null) {
            await this.furnitureFeature.remove(existingFurniture.furnitureFeatures);

            for (let feature of data.features) {
                let newFurnitureFeature: FurnitureFeature = new FurnitureFeature();
                newFurnitureFeature.furnitureId = furnitureId;
                newFurnitureFeature.featureId = feature.featureId;
                newFurnitureFeature.value     = feature.value;
    
                await this.furnitureFeature.save(newFurnitureFeature);
            }
        }
        return await this.furniture.findOne(furnitureId, {
            relations: [
                "category",
                // "availabilities",
                "furnitureFeatures",
                "features",
                //"stores",
                "furniturePrices"
            ]
        })
    }

    async search(data: FurnitureSearchDto): Promise<Furniture[] | ApiResponse> {
        const builder = await this.furniture.createQueryBuilder("furniture");

        builder.innerJoinAndSelect("furniture.furniturePrices", "fp", "fp.createdAt =  (SELECT MAX(fp.created_at) FROM furniture_price as fp WHERE fp.furniture_id = furniture.furniture_id)");
        // builder.leftJoinAndSelect("furniture.availabilities", "fa");
        // builder.leftJoinAndSelect("furniture.stores", "stores");
        builder.leftJoinAndSelect("furniture.photos", "photos");
        builder.leftJoinAndSelect("furniture.furnitureFeatures", "ff");
        builder.leftJoinAndSelect("furniture.features", "features")

        builder.where('furniture.categoryId = :catId', { catId: data.categoryId });

        if(data.keywords && data.keywords.length> 0){
            builder.andWhere(`(furniture.name LIKE :kw OR
                              furniture.description LIKE :kw)`, { kw: '%' + data.keywords.trim() + '%'});
        }
        if(data.priceMin && typeof data.priceMin === 'number'){
            builder.andWhere('fp.price >= :min', { min: data.priceMin })
        }
        if(data.priceMax && typeof data.priceMax === 'number'){
            builder.andWhere('fp.price <= :max', { max: data.priceMax })
        }

        if (data.features && data.features.length > 0) {
            for (const feature of data.features) {
                builder.andWhere(
                    'ff.featureId = :fId AND ff.value IN (:fVals)',
                    {
                        fId: feature.featureId,
                        fVals: feature.values,
                    }
                );
            }
        }

        // if(data.stores && data.stores.length > 0) {
        //     for(const store of data.stores) {
        //         builder.andWhere('fa.storeId = :sId AND fa.isAvailable IN (:sAvail)',
        //         {
        //             sId: store.storeId,
        //             sAvail: store.isAvailable,
        //         })
        //     }
        // }

        let orderBy = 'furniture.name'
        let orderDirection: 'ASC' | 'DESC' = 'ASC'

        if(data.orderBy){
            orderBy = data.orderBy

            if(orderBy === 'price'){
                orderBy = 'fp.price'
            }
            if(orderBy === 'name'){
                orderBy = 'furniture.name'
            }
        }
        if(data.orderDirection){
            orderDirection = data.orderDirection
        }

        builder.orderBy(orderBy, orderDirection)

        let page = 0;
        let perPage: 5 | 10 | 25 | 50 = 10;
        if(data.page && typeof data.page === 'number'){
            page = data.page
        }
        if(data.itemsPerPage && typeof data.itemsPerPage === 'number') {
            perPage = data.itemsPerPage
        }

        builder.skip(page * perPage)
        builder.take(perPage)

        let furnitures = await builder.getMany();

        if(furnitures.length === 0){
            return new ApiResponse("ok", 0, "There are no results found for this query.")
        }

        return furnitures;
    }
}
