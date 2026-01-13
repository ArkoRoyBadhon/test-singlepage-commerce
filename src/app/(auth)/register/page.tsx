import { redirect } from 'next/navigation'

const RegisterPage = () => {
  redirect('/auth/login')
}

export default RegisterPage
