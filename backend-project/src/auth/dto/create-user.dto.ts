import { Transform } from "class-transformer";
import {IsNotEmpty, IsOptional, IsString, MinLength} from "class-validator";

export enum Role {
    User = 'user',
    Admin = 'admin'
}

export class CreateUserDto {

  @IsString()
  @Transform(({value}) => value?.trim())
  name: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  password: string;

  @IsOptional() 
  role?: Role.User;
}
