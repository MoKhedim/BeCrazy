export default interface UserInfoFull {
    _id: string;
    bio: string;
    created: Date;
    email: string;
    nbFollowers: number;
    nbFollows: number;
    password: string;
    profilePicture: string;
    token: string;
    username: string;
}