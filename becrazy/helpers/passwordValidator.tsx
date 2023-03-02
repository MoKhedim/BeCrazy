export const passwordValidator = (password: string) => {
	// check if the password is not empty and if it is at least 5 characters long
	if (!password) return "Password can't be empty.";
	if (password.length < 5) return "Password must be at least 5 characters long.";
	return "";
};