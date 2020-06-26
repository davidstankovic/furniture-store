// import {
//   Column,
//   Entity,
//   Index,
//   OneToMany,
//   PrimaryGeneratedColumn,
//   ManyToMany,
//   JoinTable,
// } from "typeorm";
// import { Availability } from "./availability.entity";
// import { Furniture } from "./furniture.entity";
// import * as Validator from 'class-validator';

// @Index("uq_store_address", ["address"], { unique: true })
// @Index("uq_store_image_path", ["imagePath"], { unique: true })
// @Entity("store")
// export class Store {
//   @PrimaryGeneratedColumn({ type: "int", name: "store_id", unsigned: true })
//   storeId: number;

//   @Column({
//     type: "varchar", 
//     name: "image_path",
//     unique: true,
//     length: 128
//   })
//   @Validator.IsNotEmpty()
//   @Validator.IsString()
//   @Validator.Length(1,128)
//   imagePath: string;

//   @Column({ type: "varchar", name: "name", length: 50 })
//   @Validator.IsNotEmpty()
//   @Validator.IsString()
//   @Validator.Length(1, 50)
//   name: string;

//   @Column({
//     type: "varchar",
//     name: "address",
//     unique: true,
//     length: 128
//   })
//   @Validator.IsNotEmpty()
//   @Validator.IsString()
//   @Validator.Length(1,128)
//   address: string;

//   @Column({
//     type: "decimal", 
//     name: "geo_lng",
//     precision: 11,
//     scale: 8
//   })
//   @Validator.IsNotEmpty()
//   @Validator.IsPositive()
//   @Validator.IsNumber({
//     allowInfinity: false,
//     allowNaN: false,
//     maxDecimalPlaces: 8,
//   })
//   geoLng: number;

//   @Column({
//     type: "decimal", 
//     name: "geo_lat",
//     precision: 10,
//     scale: 8
//   })
//   @Validator.IsNotEmpty()
//   @Validator.IsPositive()
//   @Validator.IsNumber({
//     allowInfinity: false,
//     allowNaN: false,
//     maxDecimalPlaces: 8,
//   })
//   geoLat: number;

//   @OneToMany(() => Availability, (availability) => availability.store)
//   availabilities: Availability[];

//   @ManyToMany(type => Furniture, furniture => furniture.stores)
//   @JoinTable({
//     name: "availability",
//     joinColumn: {name: "store_id", referencedColumnName:"storeId"},
//     inverseJoinColumn: {name: "furniture_id", referencedColumnName:"furnitureId"}
//   })
//   furnitures: Furniture[];
// }
