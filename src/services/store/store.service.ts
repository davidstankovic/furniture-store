import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Store } from "entities/store.entity";

@Injectable()
export class StoreService extends TypeOrmCrudService<Store> {
    constructor(@InjectRepository(Store) private readonly store: Repository<Store>) {
        super(store);
    }
}
