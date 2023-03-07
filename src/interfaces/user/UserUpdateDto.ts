export interface UserUpdateDto {
  name?: String;
  introduction?: String;
  mannerTemperature?: Number;
  hashtags?: [String];
  isLogOut?: Boolean;
  kakaoId?: String;
  fcmToken?: String[];
}
