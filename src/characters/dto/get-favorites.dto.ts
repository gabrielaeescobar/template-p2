import { IsUUID } from "class-validator";

export class GetFavoritesDto {
    @IsUUID()
    characterId: string;
}
