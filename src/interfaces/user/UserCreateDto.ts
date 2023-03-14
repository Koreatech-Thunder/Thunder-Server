export interface UserCreateDto {
    name?: String;
    introduction?: String;
    mannerTemperature: Number;
    hashtags?: [String];
    isLogOut: Boolean;
    kakaoId?: String;
    fcmToken: String;
}