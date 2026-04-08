import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to PM Streak</h1>
      <p>Get started with your product management journey</p>
      <Link href='/login'>
        <button:Get Started</button>
      </Link>
    </div>
  );
}