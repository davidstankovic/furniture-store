import { Controller, Post, Body, Req } from "@nestjs/common";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Request } from "express";
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { jwtSecret } from "config/jwt.secret";

@Controller('auth/')
export class AuthController {
    constructor(public administratorService: AdministratorService){}

    @Post('administrator/login')
    async doAdministratorLogin(@Body() data: LoginAdministratorDto, @Req() req: Request): Promise<LoginInfoDto | ApiResponse>{
        const administrator = await this.administratorService.getByUsername(data.username);

        if(!administrator){
            return new Promise(resolve => {
                resolve(new ApiResponse('error', -3001));
            })
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        if(administrator.passwordHash !== passwordHashString){
            return new Promise(resolve => {
                resolve(new ApiResponse('error', -3002));
            })
        }


        // TOKEN = JSON { adminId, username, exp, ip, ua }

        const jwtData = new JwtDataDto();
        jwtData.role = "administrator";
        jwtData.id = administrator.administratorId;
        jwtData.identity = administrator.username;
        let now = new Date();
        now.setDate(now.getDate() + 14);
        const expiryTimestamp = now.getTime() / 1000;
        jwtData.exp = expiryTimestamp;
        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        // token(JWT)
        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret); //generisanje tokena!

        const responseObject = new LoginInfoDto(
            administrator.administratorId,
            administrator.username,
            token
        )

        return new Promise(resolve => resolve(responseObject));
    }
}