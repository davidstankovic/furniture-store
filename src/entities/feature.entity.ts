import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable
  } from "typeorm";
  import { FurnitureFeature } from "./furniture-feature.entity";
  import { Category } from "./category.entity";
  import { Furniture } from "./furniture.entity";
  import * as Validator from 'class-validator';
  
  @Index("fk_feature_category_id", ["categoryId"], {})
  @Index("uq_feature_name_category_id", ["name", "categoryId"], { unique: true })
  @Entity("feature")
  export class Feature {
    @PrimaryGeneratedColumn({ type: "int", name: "feature_id", unsigned: true })
    featureId: number;
  
    @Column({ type: "varchar", length: 32 })
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(5, 32)
    name: string;
  
    @Column({ type: "int", name: "category_id", unsigned: true })
    categoryId: number;
  
    @OneToMany(
      () => FurnitureFeature,
      furnitureFeature => furnitureFeature.feature
    )
    furnitureFeatures: FurnitureFeature[];
  
    @ManyToMany(type => Furniture, furniture => furniture.features)
    @JoinTable({
      name: "furniture_feature",
      joinColumn: { name: "feature_id", referencedColumnName: "featureId" },
      inverseJoinColumn: { name: "furniture_id", referencedColumnName: "furnitureId" }
    })
    furnitures: Furniture[];
  
    @ManyToOne(
      () => Category,
      category => category.features,
      { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
    )
    @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
    category: Category;
  }
  