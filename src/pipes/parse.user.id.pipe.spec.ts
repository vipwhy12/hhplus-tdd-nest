import { BadRequestException } from '@nestjs/common';
import { ParseUserIdPipe } from './parse.user.id.pipe';

describe('ParseUserIdPipe', () => {
  let parseUserIdpipe: ParseUserIdPipe;

  beforeEach(() => {
    parseUserIdpipe = new ParseUserIdPipe();
  });

  // Pipe가 제대로 정의되어 있고 인스턴스화 가능한지 확인하기 위한 기본 테스트
  it('Pipe가 정의되어 있어야 한다', () => {
    expect(new ParseUserIdPipe()).toBeDefined();
  });

  // ID를 숫자가 아닌 문자열을 입력했을 때 예외가 발생하는지 테스트합니다.
  describe('id 가 숫자가 아닌 경우', () => {
    const inValidId = `hello World!`;

    it('실패한다.', () => {
      const result = () => parseUserIdpipe.transform(inValidId);
      expect(result).toThrow(BadRequestException);
    });
  });

  // ID가 1 미만의 값이 입력되었을 때 예외가 발생하는지 테스트합니다.
  describe('id가 1 미만일 경우', () => {
    const negativeId = `-34`;

    it('실패한다.', () => {
      const result = () => parseUserIdpipe.transform(negativeId);
      expect(result).toThrow(BadRequestException);
    });
  });

  // 공백 문자열을 입력했을 때 예외가 발생하는지 테스트합니다.
  describe('id가 빈 문자열일 경우', () => {
    const emptyId = '';

    it('실패한다.', () => {
      const result = () => parseUserIdpipe.transform(emptyId);
      expect(result).toThrow(BadRequestException);
    });
  });

  // Null 입력했을 때 예외가 발생하는지 테스트합니다.
  describe('id가 Null일 경우', () => {
    const nullId = null;

    it('실패한다.', () => {
      const result = () => parseUserIdpipe.transform(nullId);
      expect(result).toThrow(BadRequestException);
    });
  });

  // undefined를 입력했을 때 예외가 발생하는지 테스트합니다.
  describe('id가 undefined일 경우', () => {
    const undefinedId = undefined;

    it('실패한다.', () => {
      const result = () => parseUserIdpipe.transform(undefinedId);
      expect(result).toThrow(BadRequestException);
    });
  });

  // 소수점 숫자가 입력되었을 때 올바르게 처리하는지 테스트합니다.
  describe('id가 소수일 경우', () => {
    const decimalId = '1.5';

    it('실패한다.', () => {
      const result = () => parseUserIdpipe.transform(decimalId);
      expect(result).toThrow(BadRequestException);
    });
  });

  // 숫자 외의 문자가 포함된 경우 예외가 발생하는지 테스트합니다.
  describe('id에 숫자 외의 문자가 포함된 경우', () => {
    const invalidMixedId = '123abc';

    it('실패한다.', () => {
      const result = () => parseUserIdpipe.transform(invalidMixedId);
      expect(result).toThrow(BadRequestException);
    });
  });

  // 유효한 ID 범위(1 이상)가 입력되었을 때 올바른 값이 반환되는지 테스트합니다.
  describe('id가 1 이상일 경우', () => {
    const validId = `5`;
    const expectResult = 5;

    it('성공한다.', () => {
      const result = parseUserIdpipe.transform(validId);
      expect(result).toBe(expectResult);
    });
  });
});
