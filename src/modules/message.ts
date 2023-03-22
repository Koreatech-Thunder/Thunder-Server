const message = {
  // default error status messages
  BAD_REQUEST: '잘못된 요청입니다.',
  BAD_PATH: '잘못된 경로입니다.',
  UNAUTHORIZED: '승인되지 않은 유저입니다.',
  FORBIDDEN: '권한이 없는 유저의 요청입니다.',
  NOT_FOUND: '존재하지 않는 자원입니다.',
  DUPLICATED: '이미 존재하는 데이터입니다.',
  TEMPORARY_UNAVAILABLE: '일시적으로 사용할 수 없는 서버입니다.',
  INTERNAL_SERVER_ERROR: '서버 내부 오류입니다.',
  DB_ERROR: '데이터베이스 오류입니다.',

  // etc
  NULL_VALUE: '필요한 값이 없습니다.',
  NULL_VALUE_TOKEN: '토큰이 없습니다.',
  EXPIRED_TOKEN: '만료된 토큰입니다.',
  INVALID_TOKEN: '존재하지 않는 토큰입니다.',
  INVALID_PASSWORD: '잘못된 비밀번호입니다.',
  INVALID_ID: '유효하지 않은 id입니다.',
  INVALID_HASHTAG: '유효하지 않은 hashtsg입니다.',

  SIGNUP_SUCCESS: '회원가입 성공입니다.',
  LOGIN_SUCCESS: '로그인 성공입니다.',

  //user
  NOT_FOUND_USER: '조회할 사용자 정보가 없습니다.',
  CONFLICT_USER: '이미 가입한 사용자입니다.',
  READ_USER_SUCCESS: '사용자 정보 조회 성공입니다.',
  UPDATE_USER_SUCCESS: '사용자 정보 수정 성공입니다.',
  DELETE_USER_SUCCESS: '사용자 탈퇴 성공입니다.',

  //thunder
  NOT_FOUND_ROOM: '존재하지 않는 방입니다.',
  CREATE_THUNDER_SUCCESS: '번개 정상 생성 성공입니다.',
  READ_THUNDER_SUCCESS: '번개 정보 조회 성공입니다',
  JOIN_ROOM_SUCCESS: '번개 참가 성공입니다.',
  LEAVE_ROOM_SUCCESS: '번개 나가기 성공입니다.',
  OVER_LIMITMEMBERSCNT: '제한된 인원을 초과하였습니다.',
};

export default message;
