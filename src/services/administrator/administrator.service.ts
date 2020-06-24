import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Administrator } from 'src/entities/administrator.entity';
import { Repository } from 'typeorm';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import * as crypto from 'crypto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiResponse } from 'src/misc/api.response.class';
import { AdministratorToken } from 'src/entities/administrator-token.entity';

@Injectable()
export class AdministratorService {
    constructor(
        @InjectRepository(Administrator)
        private readonly administrator: Repository<Administrator>,
        @InjectRepository(AdministratorToken) private readonly administratorToken: Repository<AdministratorToken>
    ) { 
        // super(administrator) ??
    }

    getAll(): Promise<Administrator[]> {
        return this.administrator.find();
    }
    

    async getByUsername(usernameString: string): Promise<Administrator | null>{
        const admin = await this.administrator.findOne({
            username: usernameString
        })

        if(admin){
            return admin;
        }
        return null;
    }

    getById(id: number): Promise<Administrator> {
        return this.administrator.findOne(id);
    }

    add(data: AddAdministratorDto): Promise<Administrator | ApiResponse> {
        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        const newAdmin: Administrator = new Administrator();
        newAdmin.username = data.username;
        newAdmin.passwordHash = passwordHashString;

        return new Promise(resolve => {
            this.administrator.save(newAdmin)
                .then(data => resolve(data))
                .catch(() => resolve(new ApiResponse("error", -1001)));
        });
    }

    async editById(id: number, data: EditAdministratorDto): Promise<Administrator | ApiResponse> {
        const oldAdmin = await this.administrator.findOne(id);

        if (oldAdmin === undefined) {
            return new Promise(resolve => resolve(new ApiResponse("error", -2001)));
        }

        const passwordHash = crypto.createHash('sha512');
        passwordHash.update(data.password);
        const passwordHashString = passwordHash.digest('hex').toUpperCase();

        oldAdmin.passwordHash = passwordHashString;

        return this.administrator.save(oldAdmin);
    }

    // TOKEN
    async addToken(administratorId: number, token: string, expiresAt: string){
        const administratorToken = new AdministratorToken();
        administratorToken.administratorId = administratorId;
        administratorToken.token = token;
        administratorToken.expiresAt = expiresAt;

        return await this.administratorToken.save(administratorToken);
    }

    async getAdministratorToken(token: string): Promise<AdministratorToken>{
        return await this.administratorToken.findOne({
            token: token
        });
    }

    async invalidateToken(token: string): Promise<AdministratorToken | ApiResponse> {
        const administratorToken = await this.administratorToken.findOne({
            token: token
        });

        if(!administratorToken){
            return new ApiResponse("error", -10001, "No such refresh token!");
        }

        administratorToken.isValid = 0;

        await this.administratorToken.save(administratorToken);

        return await this.getAdministratorToken(token);
    }

    async invalidateAdministratorTokens(administratorId: number): Promise<(AdministratorToken | ApiResponse)[]>{
        const administratorTokens = await this.administratorToken.find({
            administratorId: administratorId
        });

        const results = [];

        for(const administratorToken of administratorTokens){
            results.push(this.invalidateToken(administratorToken.token))
        }

        return results;
    }
}