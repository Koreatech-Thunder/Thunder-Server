export interface UserUpdateDto {
    name?: String;
    introduction?: String;
    mannerTemperature?: Number;
    hashtags?: [String];
    isLogout?: Boolean;
    kakaoId?: String;
    accessToken?: String;
    refreshToken?: String;
    fcmToken?: String[];
}