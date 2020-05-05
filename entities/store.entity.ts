import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Availability } from "./availability.entity";

@Index("uq_store_address", ["address"], { unique: true })
@Index("uq_store_image_path", ["imagePath"], { unique: true })
@Entity("store")
export class Store {
  @PrimaryGeneratedColumn({ type: "int", name: "store_id", unsigned: true })
  storeId: number;

  @Column({
    type: "varchar", 
    name: "image_path",
    unique: true,
    length: 128
  })
  imagePath: string;

  @Column({ type: "varchar", name: "name", length: 50 })
  name: string;

  @Column({
    type: "varchar",
    name: "address",
    unique: true,
    length: 128
  })
  address: string;

  @Column({
    type: "decimal", 
    name: "geo_lng",
    precision: 11,
    scale: 8
  })
  geoLng: string;

  @Column({
    type: "decimal", 
    name: "geo_lat",
    precision: 10,
    scale: 8
  })
  geoLat: string;

  @OneToMany(() => Availability, (availability) => availability.store)
  availabilities: Availability[];
}
