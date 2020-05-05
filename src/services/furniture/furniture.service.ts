import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Furniture } from "entities/furniture.entity";

@Injectable()
export class FurnitureService extends TypeOrmCrudService<Furniture> {
    constructor(@InjectRepository(Furniture) private readonly furniture: Repository<Furniture>) {
        super(furniture);
    }
}
