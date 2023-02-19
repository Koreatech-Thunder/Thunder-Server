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

  //user
  NOT_FOUND_USER_EMAIL: '가입되지 않은 사용자입니다.',
  CONFLICT_USER: '사용자 중복입니다.',
  CREATED_USER_SUCCESS: '사용자 정상 생성',
  READ_USER_SUCCESS: '사용자 정상 불러옴',

  //thunder
  CREATED_THUNDER_SUCCESS: '번개 정상 생성',
  READ_THUNDER_SUCCESS: '번개 정상 불러옴',
};

export default message;
