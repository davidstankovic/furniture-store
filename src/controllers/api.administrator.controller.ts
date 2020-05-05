import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { AdministratorService } from '../services/administrator/administrator.service';
import { Administrator } from 'entities/administrator.entity';
import { AddAdministratorDto } from 'dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'dtos/administrator/edit.administrator.dto';
import { ApiResponse } from 'src/misc/api.response.class';

@Controller('api/administrator')
export class ApiAdministratorController {
  constructor(private administratorService: AdministratorService) { }

  @Get() // GET http://localhost:3000/api/administrator/
  getAllAdministrators(): Promise<Administrator[]> {
    return this.administratorService.getAll();
  }

  @Get(':id') // GET http://localhost:3000/api/administrator/2/
  getSingleAdministrator(@Param('id') id: number): Promise<Administrator> {
    return this.administratorService.getById(id);
  }

  @Post() // POST http://localhost:3000/api/administrator/
  add(@Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse> {
    return this.administratorService.add(data);
  }

  @Post(':id') // POST http://localhost:3000/api/administrator/2/
  editById(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse> {
    return this.administratorService.editById(id, data);
  }
}
