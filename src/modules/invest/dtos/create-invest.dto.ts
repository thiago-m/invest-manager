import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsString, Min, Validate } from "class-validator";

class IsValidTimestamp {
  validate(value: number) { return !isNaN(new Date(value).getTime()); }
  defaultMessage() { return 'Invalid timestamp' }
}

export class CreateInvestDto {
  @IsString()
  @ApiProperty({ description: 'O responsável pelo investimento' })
  owner: string;
  
  @IsNumber()
  @Min(0)
  @ApiProperty({ description: 'O valor inicial investido' })
  initial_value: number

  @IsInt()
  @Validate(IsValidTimestamp)
  @ApiProperty({ description: 'A data de quando o usuário fez o investimento' })
  create_date: number
}
