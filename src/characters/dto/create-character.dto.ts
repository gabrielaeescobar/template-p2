import { IsBoolean, IsNumber, IsString, IsArray, IsOptional, IsUUID } from "class-validator";

export class CreateCharacterDto {
    @IsString()
    name: string;

    @IsNumber()
    salary: number;

    @IsBoolean()
    employee: boolean;

    @IsOptional()
    @IsUUID()
    location?: string;

    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    favorites?: string[];
}
