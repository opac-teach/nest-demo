import { SetMetadata } from '@nestjs/common';
import { RolesEnum } from './roles.enum';

export const Role = (roleName: RolesEnum) => SetMetadata('role', roleName);
