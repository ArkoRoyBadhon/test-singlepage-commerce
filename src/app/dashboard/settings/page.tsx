'use client'

import { Button } from '@/components'
import BannerSettings from '@/components/dashboard/Settings/BannerSettings'
import FaqSettings from '@/components/dashboard/Settings/FaqSettings'
import GeneralSettings from '@/components/dashboard/Settings/GeneralSettings'
import ReviewSettings from '@/components/dashboard/Settings/ReviewSettings'
import { ArrowLeft, Image as ImageIcon, Layout, MessageSquare, Star } from 'lucide-react'
import { useState } from 'react'

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'banners' | 'faqs' | 'reviews' | null>(null)

  const tabs = [
    {
      id: 'general',
      label: 'General Settings',
      icon: Layout,
      description: 'Configure site name, contact info, and social links.',
    },
    {
      id: 'banners',
      label: 'Banner Manager',
      icon: ImageIcon,
      description: 'Add, remove, or update homepage banners.',
    },
    {
      id: 'faqs',
      label: 'FAQ Manager',
      icon: MessageSquare,
      description: 'Manage customer frequently asked questions.',
    },
    {
      id: 'reviews',
      label: 'Customer Reviews',
      icon: Star,
      description: 'Manage customer reviews and testimonials.',
    },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />
      case 'banners':
        return <BannerSettings />
      case 'faqs':
        return <FaqSettings />
      case 'reviews':
        return <ReviewSettings />
      default:
        return null
    }
  }

  const activeTabLabel = tabs.find((t) => t.id === activeTab)?.label

  return (
    <div className="flex flex-col gap-8">
      {!activeTab ? (
        <>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your website content and configurations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <div
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'general' | 'banners' | 'faqs' | 'reviews')}
                  className="group cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-green-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-green-50 p-3 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white dark:bg-green-900/20 dark:text-green-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">{tab.label}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{tab.description}</p>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab(null)}
              className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{activeTabLabel}</h2>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">{renderContent()}</div>
        </div>
      )}
    </div>
  )
}

export default SettingsPage
