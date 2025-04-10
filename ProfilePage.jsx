// --- Frontend: User Profile (ProfilePage.jsx) ---
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProfilePage() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Giả sử bạn đã có một API để lấy thông tin người dùng
    axios.get('http://localhost:5000/user/profile', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => setUser(res.data))
      .catch(err => console.error('Error fetching user profile:', err));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      <div className="border p-4 rounded">
        <h3 className="text-xl font-semibold">{user.username}</h3>
        <p>Email: {user.email}</p>
        <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
        {/* Hiển thị các bài viết của người dùng */}
        <h4 className="mt-4 font-semibold">Your Posts</h4>
        {user.posts.map(post => (
          <div key={post._id} className="mt-2">
            <h5>{post.title}</h5>
            <p>{post.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfilePage;
