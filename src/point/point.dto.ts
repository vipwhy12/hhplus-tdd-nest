import { IsInt, Min } from 'class-validator';

export class PointBody {
  @IsInt({ message: `amount의 값은 정수여야 합니다.` })
  @Min(1, { message: 'amount는 0보다 큰 값이어야 합니다.' })
  amount: number;
}
