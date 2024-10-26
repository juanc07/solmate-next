import React from 'react'
import Layout from "@/components/custom/server/Layout"
import News from '@/components/custom/client/News'
import WorkGallery from '@/components/custom/client/WorkGallery'

const NewsPage = () => {
  return (
    <Layout>
    <WorkGallery title='News'/>    
    </Layout>
  )
}

export default NewsPage