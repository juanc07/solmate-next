import React from 'react'
import Layout from "@/components/custom/server/Layout"
import News from '@/components/custom/client/News'
import WorkGallery from '@/components/custom/client/WorkGallery'
import Hero from '@/components/custom/client/Hero'
import Testimonials from '@/components/custom/client/Testimonials'

const NewsPage = () => {
  return (
    <Layout>
      <Hero title='News' />
      <WorkGallery title='Recent news' />
      <Testimonials title='What Our Clients Say'/>
    </Layout>
  )
}

export default NewsPage