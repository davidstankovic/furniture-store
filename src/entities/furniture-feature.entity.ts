import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
  } from "typeorm";
  import { Furniture } from "./furniture.entity";
  import { Feature } from "./feature.entity";
  import * as Validator from 'class-validator';
  
  @Index("fk_furniture_feature_feature_id", ["featureId"], {})
  @Index("uq_furniture_feature_furniture_id_feature_id", ["furnitureId", "featureId"], {
    unique: true
  })
  @Entity("furniture_feature")
  export class FurnitureFeature {
    @PrimaryGeneratedColumn({
      type: "int",
      name: "furniture_feature_id",
      unsigned: true
    })
    furnitureFeatureId: number;
  
    @Column({ type: "int", name: "furniture_id", unsigned: true })
    furnitureId: number;
  
    @Column({ type: "int", name: "feature_id", unsigned: true })
    featureId: number;
  
    @Column({ type: "varchar", length: 255 })
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(1, 255)
    value: string;
  
    @ManyToOne(
      () => Furniture,
      furniture => furniture.furnitureFeatures,
      { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
    )
    @JoinColumn([{ name: "furniture_id", referencedColumnName: "furnitureId" }])
    furniture: Furniture;
  
    @ManyToOne(
      () => Feature,
      feature => feature.furnitureFeatures,
      { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
    )
    @JoinColumn([{ name: "feature_id", referencedColumnName: "featureId" }])
    feature: Feature;
  }
  