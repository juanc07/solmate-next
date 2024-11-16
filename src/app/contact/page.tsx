import React from 'react'
import Layout from "@/components/custom/server/Layout"
import Contact from "@/components/custom/client/Contact"
import HorizontalContactForm from "@/components/custom/client/HorizontalContactForm"

const ContactPage = () => {
  return (
    <Layout>
    <HorizontalContactForm title="Message Us"/>
    {/*<Contact title="Contact Us"/>*/}    
    </Layout>
  )
}

export default ContactPage