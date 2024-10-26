import React from 'react'
import Layout from "@/components/custom/server/Layout"
import Contact from "@/components/custom/client/Contact"
import HorizontalContactForm from "@/components/custom/client/HorizontalContactForm"

const ContactPage = () => {
  return (
    <Layout>
    <Contact title="Contact Us"/>
    <HorizontalContactForm title="Message Us"/>
    </Layout>
  )
}

export default ContactPage