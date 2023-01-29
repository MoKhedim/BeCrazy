export const passwordConfirmValidator = (password: string, passwordConfirm: string) => {
  if (password !== passwordConfirm) return "Passwords don't match."
  return ''
}
