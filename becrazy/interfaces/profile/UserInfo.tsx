export default interface UserInfo {
    _id: string;
    username: string;
    email: string;
    password: string;
    bio: string;
    // profilepicture is a base64 string
    profilepicture: string;
    created: Date;
    token: string;
    nbFollows: number;
    nbFollowers: number;
}