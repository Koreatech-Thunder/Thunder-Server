export interface UserCreateDto {
    name?: String;
    introduction?: String;
    mannerTemperature: Number;
    hashtags?: [String];
    isLogOut: Boolean;
    kakaoId?: String;
    accessToken?: String;
    refreshToken?: String;
    fcmToken: String;
}