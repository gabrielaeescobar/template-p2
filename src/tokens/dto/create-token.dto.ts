import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateTokenDto {
    
    @IsString()
    token: string;

    @IsNumber()
    reqLeft: number;

    @IsBoolean()
    active: boolean;
    
}
