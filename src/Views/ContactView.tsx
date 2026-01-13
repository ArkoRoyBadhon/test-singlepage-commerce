import ContactForm from '@/components/Contact/ContactForm'
import BreadCrumb from '@/components/ui/Bread-crumb'

const ContactView = () => {
  const breadcrumbItems = [
    { label: 'হোম', href: '/' },
    { label: 'যোগাযোগ', href: '/contact' },
  ]
  return (
    <>
      <BreadCrumb items={breadcrumbItems} />
      <ContactForm />
    </>
  )
}

export default ContactView
