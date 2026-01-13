export const formatPhoneNumber = (phone: string): string => {
  if (phone && phone.startsWith('01')) {
    return '+88' + phone
  }
  return phone
}
