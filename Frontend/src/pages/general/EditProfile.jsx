import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/editprofile.css";
import "../../styles/user-profile.css";
import BottomNav from "../../components/BottomNav";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/user/me", { withCredentials: true });
        if (res?.data) {
          setName(res.data.name || "");
          setEmail(res.data.email || "");
          if (res.data.profilePic) setPreview(res.data.profilePic);
        }
      } catch (err) {
          console.error('fetchProfile error', err);
        } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    if (name.trim() !== "") formData.append("name", name);
    if (email.trim() !== "") formData.append("email", email);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      await axios.put("http://localhost:3000/api/auth/user/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

  alert("Profile updated successfully!");
  // navigate to user profile to ensure it reloads and shows updated data
  navigate('/user');
    } catch (err) {
      console.log(err);
      alert("Error updating profile. Check backend logs.");
    }
  };

  if (loading) {
    return (
      <div className="reels-page">
        <div className="phone-frame">
          <header className="phone-header"><h1>Edit Profile</h1></header>
          <main className="phone-main">
            <div className="user-loading"><div className="spinner"></div></div>
          </main>
          <BottomNav active="user" />
        </div>
      </div>
    );
  }

  return (
    <div className="reels-page">
      <div className="phone-frame">
        <header className="phone-header">
          <div className="header-content">
            <h1 className="brand-name">Edit Profile</h1>
          </div>
        </header>

        <main className="phone-main">
          <div className="user-profile-container">
            <div className="user-profile-header">
              <div className="user-avatar">
                {preview ? (
                  <img src={preview} alt="avatar" style={{width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover'}} />
                ) : (
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="8" r="5" />
                    <path d="M3 21c0-4.4 3.6-8 8-9 4.4 1 8 4.6 8 9" />
                  </svg>
                )}
              </div>
              <h2 className="user-name">{name || "User"}</h2>
              <p className="user-email">{email || ""}</p>
            </div>

            <form className="edit-form" onSubmit={handleSubmit} style={{paddingTop: 8}}>
              <div style={{textAlign: 'center', marginBottom: 12}}>
                <label className="upload-btn">
                  Change Photo
                  <input type="file" accept="image/*" onChange={handleImageChange} />
                </label>
              </div>

              <div className="edit-field  text-amber-50">
                <label>Name</label>
                <input
                  type="text "
                  placeholder="Enter new name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="edit-field text-amber-50">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter new email (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="save-btn">
                Save Changes
              </button>
            </form>
          </div>
        </main>

        <BottomNav active="user" />
      </div>
    </div>
  );
};

export default EditProfile;
