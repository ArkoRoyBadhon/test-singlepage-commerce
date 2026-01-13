'use client'

import { logIn } from '@/actions/auth/auth.action'
import { Button, FormErrorMessage, Group, Input, Label, Link } from '@/components'
import { isErrorResponse } from '@/interfaces'
import { logInSchema } from '@/libs/validation/auth.validation'
import { Form, Formik, FormikHelpers } from 'formik'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import EmailConfirmationMessage from './EmailConfirmationMessage'

const initialValues = {
  email: '',
  password: '',
}

const LoginForm = () => {
  const router = useRouter()
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState('')

  const handleSubmit = async (values: typeof initialValues, { resetForm }: FormikHelpers<typeof initialValues>) => {
    const res = await logIn(values)

    if (isErrorResponse(res)) {
      if (res.error.data?.message.includes('EMAIL_NOT_CONFIRMED')) {
        toast.error('Your email is not verified. A new verification link has been sent to your email.')
        setUnconfirmedEmail(values.email)
        setShowEmailConfirmation(true)
        resetForm()
        return
      }

      toast.error(res.error.data?.message || 'Something went wrong')
      return
    }

    toast.success(res.message || 'Login successful')
    router.push('/dashboard') // Redirect to dashboard, proxy will handle non-admins
  }

  return (
    <>
      {showEmailConfirmation ? (
        <EmailConfirmationMessage email={unconfirmedEmail} onBack={() => setShowEmailConfirmation(false)} />
      ) : (
        <Formik initialValues={initialValues} validationSchema={logInSchema} onSubmit={handleSubmit}>
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form className="flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <Group>
                  <Label required htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your email"
                    invalid={touched.email && !!errors.email}
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                  {errors.email && touched.email && <FormErrorMessage message={errors.email} />}
                </Group>
                <Group>
                  <Label required htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your password"
                    invalid={touched.password && !!errors.password}
                    className="transition-all duration-200 focus:scale-[1.01]"
                  />
                  {errors.password && touched.password && <FormErrorMessage message={errors.password} />}
                </Group>

                <div className="flex items-center justify-end">
                  <Link
                    className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full py-2.5 text-base shadow-lg shadow-zinc-900/10 transition-transform active:scale-[0.98]"
                  loading={isSubmitting}
                  loadingText="Logging in..."
                >
                  Login
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  )
}

export default LoginForm
