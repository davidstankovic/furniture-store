import { Controller, Get, Param, Post, Body, SetMetadata, UseGuards, Patch } from '@nestjs/common';
import { AdministratorService } from '../services/administrator/administrator.service';
import { Administrator } from 'src/entities/administrator.entity';
import { AddAdministratorDto } from 'src/dtos/administrator/add.administrator.dto';
import { EditAdministratorDto } from 'src/dtos/administrator/edit.administrator.dto';
import { ApiResponse } from 'src/misc/api.response.class';
import { AllowToRoles } from 'src/misc/allow.to.roles.descriptor';
import { RoleCheckerGuard } from 'src/misc/role.checker.guard';

@Controller('api/administrator')
export class ApiAdministratorController {
  constructor(private administratorService: AdministratorService) { }

  @Get() // GET http://localhost:3000/api/administrator/
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  getAllAdministrators(): Promise<Administrator[]> {
    return this.administratorService.getAll();
  }

  @Get(':id') // GET http://localhost:3000/api/administrator/2/
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  getSingleAdministrator(@Param('id') id: number): Promise<Administrator> {
    return this.administratorService.getById(id);
  }

  @Post() // POST http://localhost:3000/api/administrator/
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  add(@Body() data: AddAdministratorDto): Promise<Administrator | ApiResponse> {
    return this.administratorService.add(data);
  }

  @Patch(':id') // POST http://localhost:3000/api/administrator/2/
  @UseGuards(RoleCheckerGuard)
  @AllowToRoles('administrator')
  editById(@Param('id') id: number, @Body() data: EditAdministratorDto): Promise<Administrator | ApiResponse> {
    return this.administratorService.editById(id, data);
  }
}
