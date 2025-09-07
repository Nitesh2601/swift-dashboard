import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom";


interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}

const ProfilePage: React.FC = () => {

  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const data: User[] = await res.json();
        setUser(data[1]); // take first user
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      

      {/* Profile Section */}
      <main className="max-w-5xl mx-auto mt-8 bg-white shadow-md rounded-md p-8">

        <div className="flex items-center gap-2 mb-6">
          <ArrowLeft 
            className="w-5 h-5 text-gray-700 cursor-pointer" 
            onClick={() => navigate(-1)} 
          />
          <h2 className="text-lg font-semibold">Welcome, Ervin Howell</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left side - user avatar and info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 text-xl font-semibold text-gray-600">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          {/* Right side (empty to align layout like your UI) */}
          <div></div>
        </div>

        {/* User details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div>
            <label className="block text-sm text-gray-500">User ID</label>
            <input
              value={user.id}
              disabled
              className="w-full mt-1 rounded-md bg-gray-100 p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500">Name</label>
            <input
              value={user.name}
              disabled
              className="w-full mt-1 rounded-md bg-gray-100 p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500">Email ID</label>
            <input
              value={user.email}
              disabled
              className="w-full mt-1 rounded-md bg-gray-100 p-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500">Address</label>
            <input
              value={`${user.address.street}, ${user.address.city}`}
              disabled
              className="w-full mt-1 rounded-md bg-gray-100 p-2 truncate"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500">Phone</label>
            <input
              value={user.phone}
              disabled
              className="w-full mt-1 rounded-md bg-gray-100 p-2"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
