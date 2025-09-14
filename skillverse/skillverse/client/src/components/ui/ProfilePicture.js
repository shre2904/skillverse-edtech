import React, { useState, useRef } from 'react';
import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ProfilePicture = ({ size = 'md', showEdit = true, className = '' }) => {
  const { user, updateProfile } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6',
    '2xl': 'h-8 w-8'
  };

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setImageError(false);
    try {
      const response = await authAPI.uploadAvatar(file);
      if (response.success) {
        // Update user context with new avatar
        await updateProfile({ avatar: response.avatar });
        toast.success('Profile picture updated successfully!');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      const response = await authAPI.removeAvatar();
      if (response.success) {
        await updateProfile({ avatar: '' });
        setImageError(false);
        toast.success('Profile picture removed successfully!');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Avatar removal error:', error);
      toast.error(error.message || 'Failed to remove profile picture');
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const shouldShowImage = user?.avatar && !imageError;
  const shouldShowInitials = !user?.avatar || imageError;

  return (
    <div className={`relative group ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold`}>
        {shouldShowImage ? (
          <img
            src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${user.avatar}`}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : null}
        {shouldShowInitials && (
          <div className="w-full h-full flex items-center justify-center">
            {getInitials(user?.name || 'U')}
          </div>
        )}
      </div>

      {showEdit && (
        <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <div className="flex space-x-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors disabled:opacity-50"
              title="Upload new picture"
            >
              <CameraIcon className={`${iconSizes[size]} text-white`} />
            </button>
            {user?.avatar && (
              <button
                onClick={handleRemoveAvatar}
                className="p-1 bg-red-500/80 hover:bg-red-500 rounded-full transition-colors"
                title="Remove picture"
              >
                <XMarkIcon className={`${iconSizes[size]} text-white`} />
              </button>
            )}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfilePicture; 