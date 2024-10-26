import React from 'react'
import Layout from "@/components/custom/server/Layout"
import Hero from "@/components/custom/client/Hero"
import WorkGallery from "@/components/custom/client/WorkGallery"
import Testimonials from "@/components/custom/client/Testimonials"
import HorizontalContactForm from "@/components/custom/client/HorizontalContactForm"

const OurWorkPage = () => {
  return (
    <Layout>
    <Hero title="Our Work"/>
    <WorkGallery title ="Recent Projects" />
    <Testimonials title="What Our Clients Say"/>
    <HorizontalContactForm title="Message Us"/>
    </Layout>
  )
}

export default OurWorkPage