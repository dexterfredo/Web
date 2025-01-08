import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserProfile.css';

function UserProfile() {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    avatar_url: ''
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const defaultAvatar = '/images/avatars/cat.jpg';
  const baseUrl = 'http://localhost:3001';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${baseUrl}/api/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setProfileData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Ошибка при загрузке профиля');
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверка размера файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${baseUrl}/api/profile/avatar`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setProfileData(prev => ({
          ...prev,
          avatar_url: response.data.avatar_url
        }));
      }
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err.response?.data?.message || 'Ошибка при загрузке аватара');
    } finally {
      setUploading(false);
    }
  };

  const getAvatarUrl = () => {
    if (!profileData.avatar_url) return defaultAvatar;
    return profileData.avatar_url.startsWith('http') 
      ? profileData.avatar_url 
      : `${baseUrl}${profileData.avatar_url}`;
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar-container">
              <img
                src={getAvatarUrl()}
                alt="Аватар пользователя"
                className="profile-avatar"
                onError={(e) => {
                  console.log('Avatar load error, using default');
                  e.target.src = defaultAvatar;
                }}
              />
              {uploading && (
                <div className="avatar-overlay">
                  <div className="loading-spinner"></div>
                </div>
              )}
            </div>
            <div className="avatar-upload">
              <label 
                htmlFor="avatar-input" 
                className={`avatar-upload-button ${uploading ? 'disabled' : ''}`}
              >
                {uploading ? 'Загрузка...' : 'Изменить аватар'}
              </label>
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        <div className="profile-info">
          <div className="profile-field">
            <label>Имя пользователя:</label>
            <span>{profileData.username || 'Не указано'}</span>
          </div>
          
          <div className="profile-field">
            <label>Email:</label>
            <span>{profileData.email || 'Не указано'}</span>
          </div>

          <div className="profile-field">
            <label>О себе:</label>
            <span>{profileData.bio || 'Информация отсутствует'}</span>
          </div>

          <div className="profile-field">
            <label>Дата регистрации:</label>
            <span>
              {new Date(profileData.registration_date).toLocaleDateString('ru-RU')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;