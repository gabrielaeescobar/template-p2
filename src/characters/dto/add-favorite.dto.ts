import { IsUUID, IsArray } from "class-validator";

export class AddFavoriteDto {
    @IsUUID()
    characterId: string;

    @IsArray()
    @IsUUID('all', { each: true })
    locationIds: string[];
}
