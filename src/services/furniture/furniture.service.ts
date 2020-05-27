import { Injectable } from "@nestjs/common";
import { Repository, QueryBuilder, In } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Furniture } from "src/entities/furniture.entity";
import { AddFurnitureDto } from "src/dtos/furniture/add.furniture.dto";
import { EditFurnitureDto } from "src/dtos/furniture/edit.furniture.dto";
import { ApiResponse } from "src/misc/api.response.class";
import { FurniturePrice } from "src/entities/furniture-price.entity";
import { Availability } from "src/entities/availability.entity";
import { FurnitureSearchDto } from "src/dtos/furniture/furniture.search.dto";

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

    async editFullFurniture(furnitureId: number, data: EditFurnitureDto): Promise<Furniture | ApiResponse>{
        const existingFurniture: Furniture = await this.furniture.findOne(furnitureId, {
            relations: ['furniturePrices', 'availabilities']
        });

        if(!existingFurniture){
            return new ApiResponse('error', -5001, 'Article not found!');
        }

        existingFurniture.name = data.name;
        existingFurniture.categoryId = data.categoryId;
        existingFurniture.description = data.description;
        existingFurniture.status = data.status;
        existingFurniture.construction = data.construction;
        existingFurniture.color = data.color;
        existingFurniture.height = data.height;
        existingFurniture.width = data.width;
        existingFurniture.deep = data.deep;
        existingFurniture.material = data.material;

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

        if(data.stores !== null){
            await this.availability.remove(existingFurniture.availabilities)
            for (let store of data.stores){
                let newAvailability: Availability = new Availability();
                newAvailability.furnitureId = furnitureId;
                newAvailability.storeId = store.storeId;
                newAvailability.isAvailable = store.isAvailable;
    
                await this.availability.save(newAvailability);
            }
        }
        return await this.furniture.findOne(furnitureId, {
            relations: [
                "category",
                "availabilities",
                "stores",
                "furniturePrices",
                "photos"
            ]
        })
    }

    async search(data: FurnitureSearchDto): Promise<Furniture[]> {
        const builder = await this.furniture.createQueryBuilder("furniture");

        builder.innerJoinAndSelect("furniture.furniturePrices", "fp", "fp.createdAt =  (SELECT MAX(fp.created_at) FROM furniture_price as fp WHERE fp.furniture_id = furniture.furniture_id)");
        builder.leftJoin("furniture.availabilities", "fa");

        builder.where('furniture.categoryId = :catId', { catId: data.categoryId });

        if(data.keywords && data.keywords.length> 0){
            builder.andWhere(`(furniture.name LIKE :kw OR
                              furniture.description LIKE :kw OR
                              furniture.color LIKE :kw OR
                              furniture.material LIKE :kw)`, { kw: '%' + data.keywords.trim() + '%'})
        }
        if(data.priceMin && typeof data.priceMin === 'number'){
            builder.andWhere('fp.price >= :min', { min: data.priceMin })
        }
        if(data.priceMax && typeof data.priceMax === 'number'){
            builder.andWhere('fp.price <= :max', { max: data.priceMax })
        }
        if(data.color && typeof data.color === 'string'){
            builder.andWhere('furniture.color = :clr', { clr: data.color })
        }
        if(data.material && typeof data.material === 'string'){
            builder.andWhere('furniture.material = :mrl', { mrl: data.material })
        }
        // DIMENZIJE
        if(data.height && typeof data.height === 'number'){
            builder.andWhere('furniture.height = :hei', { hei: data.height })
        }
        if(data.width && typeof data.width === 'number'){
            builder.andWhere('furniture.width = :wth', { wth: data.width })
        }
        if(data.deep && typeof data.deep === 'number'){
            builder.andWhere('furniture.deep = :dp', { dp: data.deep })
        }

        if(data.stores && data.stores.length > 0) {
            for(const store of data.stores) {
                builder.andWhere('fa.storeId = :sId AND fa.isAvailable IN (:sAvail)',
                {
                    sId: store.storeId,
                    sAvail: store.isAvailable,
                })
            }
        }

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

        let furnitureIds = await (await builder.getMany()).map(furniture => furniture.furnitureId);

        return await this.furniture.find({
            where: { furnitureId: In(furnitureIds)},
            relations: [
                "category",
                "availabilities",
                "stores",
                "furniturePrices",
                "photos"
            ]
        });
    }
}
