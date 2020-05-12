import { NestMiddleware, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { AdministratorService } from "src/services/administrator/administrator.service";
import * as jwt from 'jsonwebtoken';
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { jwtSecret } from "config/jwt.secret";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor( private readonly administratorService: AdministratorService){}
    
    async use(req: Request, res: Response, next: NextFunction) {
    
       if (!req.headers.authorization){
            throw new HttpException('Token not found', HttpStatus.UNAUTHORIZED);
        }

        const token = req.headers.authorization;

        const tokenParts = token.split(' ');
        if (tokenParts.length != 2){
            throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
        }

        const tokenString = tokenParts[1];
        
        let jwtData: JwtDataDto;

        try{
            jwtData = jwt.verify(tokenString, jwtSecret);
        } catch(e){
            throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
        }

        if(!jwtData){
            throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ip !== req.ip.toString()){
            throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.ua !== req.headers["user-agent"]){
            throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
        }

        if(jwtData.role === "administrator"){
            const administrator = await this.administratorService.getById(jwtData.id);
            if(!administrator){
                throw new HttpException('Account not found!', HttpStatus.UNAUTHORIZED);
            }
        }
        const nowTimestamp = new Date().getTime() / 1000;
        if(nowTimestamp >= jwtData.exp){
            throw new HttpException('Token expired!', HttpStatus.UNAUTHORIZED);
        }

        next();
    }
}