export interface UserUpdateDto {
    name?: String;
    introduction?: String;
    mannerTemperature?: Number;
    hashtags?: [String];
    isLogout?: Boolean;
    kakaoId?: Number;
    kakaoToken?: String;
    fcmToken?: String;
}