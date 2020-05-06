import { FurnitureService } from "src/services/furniture/furniture.service";
import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Furniture } from "entities/furniture.entity";
import { AddFurnitureDto } from "dtos/furniture/add.furniture.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { StorageConfig } from "config/storage.config";
import { diskStorage } from "multer";
import { PhotoService } from "src/services/photo/photo.service";
import { Photo } from "entities/photo.entity";
import { ApiResponse } from "src/misc/api.response.class";

@Controller('api/furniture')
@Crud({
    model: { type: Furniture },
    params: { id: { field: 'furnitureId', type: 'number', primary: true } },
    query: {
        join: {
            category: { eager: true },
            furniturePrices: { eager: false },
            photos: { eager: true },
            availabilities: {eager: true},
            stores: {eager: true}
        }
    }
})
export class ApiFurnitureController {
    constructor(public service: FurnitureService,
                public photoService: PhotoService) { }

    @Post('createFull') //POST
    createFullFurniture(@Body() data: AddFurnitureDto){
        return this.service.createFullFurniture(data);
    }

    @Post(':id/uploadPhoto/') // POST http://localhost:3000/api/furniture/:id/uploadPhoto/
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photoDestination,
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
                    req.fileFilterError = 'Bad file content!!';
                    callback(null, false);
                    return;
                }

                callback(null, true);
            },
            limits: {
                files: 1, // Koliko slika mozemo postaviti
                fileSize: StorageConfig.photoMaxFileSize
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

        const newPhoto: Photo = new Photo();
        newPhoto.furnitureId = furnitureId;
        newPhoto.imagePath = photo.filename;

        const savedPhoto = await this.photoService.add(newPhoto);
        if(!savedPhoto){
            return new ApiResponse('error', -4001);
        }

        return savedPhoto;
    }
}
