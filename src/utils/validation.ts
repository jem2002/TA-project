export const validateRequired = (value: any): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0
  }
  return value !== null && value !== undefined
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export const validatePhone = (phone: string): boolean => {
  // Basic phone validation - can be enhanced based on requirements
  const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
  return phoneRegex.test(phone)
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength
}

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength
}
