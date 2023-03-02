export const emailValidator = (email: string) => {
	// check if the email is not empty and if it is a valid email
	// so if it contains @ and .
	const re = /\S+@\S+\.\S+/;
	if (!email) return "Email can't be empty.";
	if (!re.test(email)) return "Ooops! We need a valid email address.";
	return "";
};