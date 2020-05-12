import { FurnitureService } from "src/services/furniture/furniture.service";
import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, Req, Delete, Patch, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Furniture } from "src/entities/furniture.entity";
import { AddFurnitureDto } from "src/dtos/furniture/add.furniture.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageConfig } from "config/storage.config";
import { diskStorage } from "multer";
import { PhotoService } from "src/services/photo/photo.service";
import { Photo } from "src/entities/photo.entity";
import { ApiResponse } from "src/misc/api.response.class";
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from 'sharp';
import { EditFurnitureDto } from "src/dtos/furniture/edit.furniture.dto";
import { AllowToRoles } from "src/misc/allow.to.roles.descriptor";
import { RoleCheckerGuard } from "src/misc/role.checker.guard";

@Controller('api/furniture')
@Crud({
    model: { type: Furniture },
    params: { id: { field: 'furnitureId', type: 'number', primary: true } },
    query: {
        join: {
            category: { eager: true },
            furniturePrices: { eager: false },
            photos: { eager: true },
            availabilities: {eager: false},
            stores: {eager: true}
        }
    },
    routes: {
        only: [
            'getOneBase', 'getManyBase'
        ],
        getOneBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator')
            ]
        },
        getManyBase: {
            decorators: [
                UseGuards(RoleCheckerGuard),
                AllowToRoles('administrator')
            ]
        }
    }
})
export class ApiFurnitureController {
    constructor(public service: FurnitureService,
                public photoService: PhotoService) { }

    
    @Post() //POST
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    createFullFurniture(@Body() data: AddFurnitureDto){
        return this.service.createFullFurniture(data);
    }

    
    @Patch(':id')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    editFullFurniture(@Param('id') id: number, @Body() data: EditFurnitureDto){
        return this.service.editFullFurniture(id, data);
    }

    @Post(':id/uploadPhoto/') // POST http://localhost:3000/api/furniture/:id/uploadPhoto/
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photo.destination,
                filename: (req, file, callback) => {
                    let original: string = file.originalname;

                    let normalized = original.replace(/\s+/g, '-');
                    normalized = normalized.replace(/[^A-z0-9\.\-]/g, '');
                    let now = new Date();
                    let datePart = '';
                    datePart += now.getFullYear().toString();
                    datePart += (now.getMonth() + 1).toString();
                    datePart += now.getDate().toString();

                    let random10elements = new Array(10);
                    let randomPart: string = random10elements.fill(0).map(e => (Math.random() * 9).toFixed(0).toString()).join('');

                    let fileName = datePart + '-' + randomPart + '-' + normalized;

                    fileName = fileName.toLocaleLowerCase();

                    callback(null, fileName);

                }
            }),
            fileFilter: (req, file, callback) => {
               
                //1. check extension: JPG, PNG
                if(!file.originalname.toLowerCase().match(/\.(jpg|png)$/)){
                    req.fileFilterError = 'Bad file extension!';
                    callback(null, false);
                    return;
                } 
                //2. Check content type: jpeg, png (mimetype)
                if(!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))){
                    req.fileFilterError = 'Bad file content type!!';
                    callback(null, false);
                    return;
                }

                callback(null, true);
            },
            limits: {
                files: 1, // Koliko slika mozemo postaviti
                fileSize: StorageConfig.photo.maxSize
            }
        })
    )
    async uploadPhoto(@Param('id') furnitureId: number, @UploadedFile() photo, @Req() req): Promise<ApiResponse | Photo>{

        if(req.fileFilterError){
            return new ApiResponse('error', -4002, req.fileFilterError);
        }

        if(!photo){
            return new ApiResponse('error', -4002, 'File not uploaded!');
        }

        const fileTypeResult = await fileType.fromFile(photo.path);
        if(!fileTypeResult){
            fs.unlinkSync(photo.path)
            return new ApiResponse('error', -4002, 'Cannot detect file type!');
        }

        const realMimetype = fileTypeResult.mime;
        
        if(!(realMimetype.includes('jpeg') || realMimetype.includes('png'))){
            fs.unlinkSync(photo.path)
            return new ApiResponse('error', -4002, 'Bad file content type!');

        }

        await this.createResizedImage(photo, StorageConfig.photo.resize.thumb)
        await this.createResizedImage(photo, StorageConfig.photo.resize.small)


        const newPhoto: Photo = new Photo();
        newPhoto.furnitureId = furnitureId;
        newPhoto.imagePath = photo.filename;

        const savedPhoto = await this.photoService.add(newPhoto);
        if(!savedPhoto){
            return new ApiResponse('error', -4001);
        }

        return savedPhoto;
    }

    async createResizedImage(photo, resizeSettings){
        const originalFilePath = photo.path;
        const fileName = photo.filename;
        const destinationFilePath = StorageConfig.photo.destination + resizeSettings.directory + fileName;

        await sharp(originalFilePath)
            .resize({
                fit: 'cover', // pogledaj doc ako treba
                width: resizeSettings.width,
                height: resizeSettings.height,
                // background: {
                //     r: 255, g:255, b:255, alpha: 0.0
                // }
            }).toFile(destinationFilePath);
    } 

    @Delete(':furnitureId/deletePhoto/:photoId/')
    @UseGuards(RoleCheckerGuard)
    @AllowToRoles('administrator')
    public async deletePhoto(@Param('furnitureId') furnitureId: number, @Param('photoId') photoId: number){
        const photo = await this.photoService.findOne({
            furnitureId: furnitureId,
            photoId: photoId
        });

        if(!photo){
            return new ApiResponse('error', -4004, 'Photo not found!');
        }

        try {
        fs.unlinkSync(StorageConfig.photo.destination + photo.imagePath);
        fs.unlinkSync(StorageConfig.photo.destination + StorageConfig.photo.resize.thumb.directory + photo.imagePath);
        fs.unlinkSync(StorageConfig.photo.destination + StorageConfig.photo.resize.small.directory + photo.imagePath);
        } catch(e){}
        const deleteResult = await this.photoService.deleteById(photo.photoId);

        if(deleteResult.affected === 0){
            return new ApiResponse('error', -4004, 'Photo not found!');
        }

        return new ApiResponse('ok', 0, 'One photo deleted!');
    }
}
