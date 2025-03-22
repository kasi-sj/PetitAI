'use client'
import { CreatePetitionForm } from '@/components/create-petition-form';
import React from 'react'

const page = () => {
    
    
  return (
    <div className='container w-1/3 mx-auto flex flex-col mt-10'>
      <h1 className='text-2xl font-semibold mb-4'>Create a petition</h1>
      <CreatePetitionForm />
    </div>
  )
}

export default page
