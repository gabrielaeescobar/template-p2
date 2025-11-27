import { IsArray, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateLocationDto {
    @IsString()
    name: string;

    @IsNumber()
    cost: number;

    @IsString()
    type: string;

    @IsOptional()
    @IsUUID()
    owner: string;

    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    favorites?: string[];
}
