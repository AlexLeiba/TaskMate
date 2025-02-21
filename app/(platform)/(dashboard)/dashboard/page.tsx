import React from 'react';
import { currentUser } from '@clerk/nextjs/server';

async function Dashboard() {
  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  return <div>Welcome, {user?.firstName || 'not found'}!</div>;
}

export default Dashboard;
