import { IsUUID } from "class-validator";

export class RemoveFavoriteDto {
    @IsUUID()
    characterId: string;

    @IsUUID()
    locationId: string;
}
