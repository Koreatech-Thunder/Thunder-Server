export interface UserCreateDto {
    name: String;
    introduction?: String;
    mannerTemperature: Number;
    hashtags?: [String];
    isLogOut: Boolean;
    kakaoId: Number;
    kakaoToken: String;
    fcmToken: String;
}