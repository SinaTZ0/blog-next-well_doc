"use client"
import React from 'react'
import { faker } from '@faker-js/faker';

const page = () => {


 const gg = {
    userId: faker.string.uuid(),
    username: faker.internet.username(), // before version 9.1.0, use userName()
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };


  return (
    <div>page{gg.password}</div>
  )
}

export default page