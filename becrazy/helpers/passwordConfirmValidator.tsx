export const passwordConfirmValidator = (password: string, passwordConfirm: string) => {
  // check if the password is not empty and if it is equal to the confirm password
  if (password !== passwordConfirm) return "Passwords don't match."
  return ''
}
