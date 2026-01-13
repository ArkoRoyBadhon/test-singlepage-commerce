import Blog from '@/components/Blogs/Blog'
import BreadCrumb from '@/components/ui/Bread-crumb'

const BlogViews = () => {
  const breadcrumbItems = [
    { label: 'হোম', href: '/' },
    { label: 'ব্লগ', href: '/blog' },
  ]
  return (
    <div>
      <BreadCrumb items={breadcrumbItems} />
      <Blog />
    </div>
  )
}

export default BlogViews
