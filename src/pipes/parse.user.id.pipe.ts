import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseUserIdPipe implements PipeTransform {
  transform(id: string): number {
    //소수점, 문자 등 허용하지 않음
    if (!/^\d+$/.test(id))
      throw new BadRequestException(`입력값 '${id}'는 유효한 정수가 아닙니다.`);

    const userID = parseInt(id);

    if (isNaN(userID))
      throw new BadRequestException(`입력값 '${id}'는 유효한 정수가 아닙니다.`);

    if (userID < 1)
      throw new BadRequestException(`입력값 id는 1 이상이여야 합니다.`);

    return userID;
  }
}
