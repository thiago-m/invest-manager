import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Invest extends Document {
  @Prop({ required: true })
  @ApiProperty({ description: 'O responsável pelo investimento' })
  owner: String
  
  @Prop({ required: true })
  @ApiProperty({ description: 'O id do usuário que fez o investimento' })
  user_id: String

  @Prop({ required: true })
  @ApiProperty({ description: 'A data de quando o usuário fez o investimento' })
  create_date: number

  @Prop({ required: true })
  @ApiProperty({ description: 'O valor inicial investido' })
  initial_value: number

  @Prop()
  @ApiProperty({ description: 'O valor total investido (proventos + valor inicial)', required: false })
  total_value: number

  @Prop({ type: [{ value: Number, reference: String }], default: [] })
  @ApiProperty({ description: 'Lista contendo o mês de referencia e o valor do provento recebido', required: false })
  earnings: Array<{value: number, reference: string}>
  
  @Prop({ type: Object})
  @ApiProperty({ description: 'Porcentagem e valor total taxado dos proventos recebido do investimento', required: false })
  taxation: { percentage: number, value: number }
  
  @Prop()
  @ApiProperty({ description: 'O valor total retirado do investido (proventos + valor inicial - valor da tributação)', required: false })
  withdrawal_amount: number
  
  @Prop({default: true})
  @ApiProperty({ description: 'Identificador se o investimento esta ativo ou não' })
  active: Boolean
}

export const InvestSchema = SchemaFactory.createForClass(Invest);
