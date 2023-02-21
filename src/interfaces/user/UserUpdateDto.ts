export interface UserUpdateDto {
    name?: String;
    introduction?: String;
    mannerTemperature?: Number;
    hashtags?: [String];
    kakaoId?: Number;
    fcmToken?: String;
}