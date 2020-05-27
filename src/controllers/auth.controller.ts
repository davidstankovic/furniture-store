import { Controller, Post, Body, Req, HttpException, HttpStatus, UseGuards } from "@nestjs/common";
import { AdministratorService } from "src/services/administrator/administrator.service";
import { LoginAdministratorDto } from "src/dtos/administrator/login.administrator.dto";
import { ApiResponse } from "src/misc/api.response.class";
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Request } from "express";
import { LoginInfoDto } from "src/dtos/auth/login.info.dto";
import { JwtDataDto } from "src/dtos/auth/jwt.data.dto";
import { jwtSecret } from "config/jwt.secret";
import { JwtRefreshDto } from "src/dtos/auth/jwt.refresh.dto";
import { AdministratorRefreshTokenDto } from "src/dtos/auth/administrator.refresh.token.dto";

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

        jwtData.exp = this.getDatePlus(60 * 5); // 5 min

        jwtData.ip = req.ip.toString();
        jwtData.ua = req.headers["user-agent"];

        // token(JWT)
        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret); //generisanje tokena!

        const jwtRefresh = new JwtRefreshDto();
        jwtRefresh.role = jwtData.role;
        jwtRefresh.id = jwtData.id;
        jwtRefresh.identity = jwtData.identity;
        jwtRefresh.exp = this.getDatePlus(60 * 60 * 24 * 31); //mesec dana
        jwtRefresh.ip = jwtData.ip;
        jwtRefresh.ua = jwtData.ua;

        let refreshToken: string = jwt.sign(jwtRefresh.toPlainObject(),jwtSecret);

        const responseObject = new LoginInfoDto(
            administrator.administratorId,
            administrator.username,
            token,
            refreshToken,
            this.getIsoDate(jwtRefresh.exp)
        );

        await this.administratorService.addToken(administrator.administratorId, refreshToken, this.getDatabaseDateFormat(this.getIsoDate(jwtRefresh.exp)));

        return new Promise(resolve => resolve(responseObject));
    }

    @Post('administrator/refresh')
    async administratorTokenRefresh(@Req() req: Request, @Body() data: AdministratorRefreshTokenDto): Promise<LoginInfoDto | ApiResponse>{
        const administratorToken = await this.administratorService.getAdministratorToken(data.token);

        if(!administratorToken){
            return new ApiResponse("error", -10002, "No such refresh token!");
        }

        if(administratorToken.isValid === 0){
            return new ApiResponse("error", -10003, "The token is no longer valid!");
        }

        const sada = new Date();
        const datumIsteka = new Date(administratorToken.expiresAt);

        if(datumIsteka.getTime() < sada.getTime()) {
            return new ApiResponse("error", -10004, "The token has expired!");
        }

        let jwtRefresh: JwtRefreshDto;

        try{
            jwtRefresh = jwt.verify(data.token, jwtSecret);
        } catch(e){
            throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
        }

        if(!jwtRefresh){
            throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
        }

        if(jwtRefresh.ip !== req.ip.toString()){
            throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
        }

        if(jwtRefresh.ua !== req.headers["user-agent"]){
            throw new HttpException('Bad token found!', HttpStatus.UNAUTHORIZED);
        }

        const jwtData = new JwtDataDto();
        jwtData.role = jwtRefresh.role;
        jwtData.id = jwtRefresh.id;
        jwtData.identity = jwtRefresh.identity;

        jwtData.exp = this.getDatePlus(60 * 5); // 5 min

        jwtData.ip = jwtRefresh.ip
        jwtData.ua = jwtRefresh.ua

        // token(JWT)
        let token: string = jwt.sign(jwtData.toPlainObject(),jwtSecret); //generisanje tokena

        const responseObject = new LoginInfoDto(
            jwtData.id,
            jwtData.identity,
            token,
            data.token,
            this.getIsoDate(jwtRefresh.exp)
        );

        return responseObject
    }

    // Koliko traje Token
    private getDatePlus(numberOfSeconds: number): number{
        return new Date().getTime() / 1000 + numberOfSeconds;
    }

    private getIsoDate(timestamp: number){
        const date = new Date();
        date.setTime(timestamp * 1000);
        return date.toISOString();
    }

    private getDatabaseDateFormat(isoFormat: string): string{
        return isoFormat.substr(0,19).replace('T', ' ');
    }
}