import { Injectable } from "@nestjs/common";
import { Availability } from "src/entities/availability.entity";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
//import DistinctAvailabilityStoresDto from "src/dtos/availability/distinct.availability.stores.dto";
import { Store } from "src/entities/store.entity";

@Injectable()
export class AvailabilityService extends TypeOrmCrudService<Availability> {
    constructor(@InjectRepository(Availability) private readonly availability: Repository<Availability>,
                @InjectRepository(Store) private readonly store: Repository<Store>
    ) {
        super(availability);
    }

    // async getAvailableStoresByFurnitureId(furnitureId: number): Promise<DistinctAvailabilityStoresDto>{
    //     const availabilities = await this.availability.find({
    //         furnitureId: furnitureId
    //     });

    //     const availabilityResult: DistinctAvailabilityStoresDto = {
    //         availabilities: []
    //     }

        // if(!availabilities || availabilities.length === 0){
        //     return availabilityResult;
        // }

    //     availabilityResult.availabilities = availabilities.map(availability => {
    //         const availableStores: string[] = this.availability.createQueryBuilder("av")
    //                                      .select("DISTINCT av.is_available", 'is_available')
    //                                      .where('st.store = :storeId', { storeId: availability.storeId})
    //                                      .getRawMany()
    //         return {
    //             availabilityId: availability.availabilityId,
    //             storeId: availability.storeId,
    //             isAvailable: availableStores
    //         }
    //     })

    // }
}
