interface Users {
    username: string;
    email: string;
    password: string;
    created: Date;
    token: string;
    nbFollows: number;
    nbFollowers: number;
}

export default Users;