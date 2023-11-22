// UserProfile.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// element used to display user settings
const UserProfile = () => {
    // get userId from Redux Storage
    const userId = '1';

    // use state to save user state
    const [userData, setUserData] = useState<{
        id: string;
        username: string;
        fullName: string;
        bio: string;
      } | null>(null);

    // get user setting from the server or Redux
    useEffect(() => {
      // Request for user setting data async
      setTimeout(() => {
        // mock data, assume the data will be retrived from other place
        const mockUserData = {
          id: userId || '', // make sure the userId is not undefined
          username: 'john_doe',
          fullName: 'John Doe',
          bio: 'Web Developer',
          // other data ....
        };

        // change state to trigger new render
        setUserData(mockUserData);
      }, 1000); // mock 1s data retrive delay
    }, [userId]); // when userId changed, rerender the page


  // display Loading when retriving the data
  if (!userData) {
    return <div>Loading...</div>;
  }

  // render the final setting page
  return (
    <div className="w-full h-fit mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-3xl font-semibold mb-4">{userData.fullName}</h2>
      <p className="text-gray-600">@{userData.username}</p>
      <p className="text-gray-800 mt-2">{userData.bio}</p>

      {/* display other setting data*/}

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
        <p className="text-gray-800">Email: john@example.com</p>
        <p className="text-gray-800">Website: www.johndoe.com</p>
        {/* other profile details... */}
      </div>
    </div>
  );
};

export default UserProfile;
