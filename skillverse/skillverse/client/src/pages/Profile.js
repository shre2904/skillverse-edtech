import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { 
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ProfilePicture from '../components/ui/ProfilePicture';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await updateProfile(data);
      if (response.success) {
        toast.success('Profile updated successfully!');
        reset(data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Profile Settings</h1>
          <p className="text-text-secondary mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-text-primary">Profile Picture</h3>
              </CardHeader>
              <CardContent className="text-center">
                <ProfilePicture 
                  size="2xl" 
                  showEdit={true}
                  className="mx-auto mb-4"
                />
                <p className="text-sm text-text-secondary">
                  Click on the camera icon to upload a new picture
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-medium text-text-primary">Personal Information</h3>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <Input
                      label="Full Name"
                      type="text"
                      {...register('name', {
                        required: 'Name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters',
                        },
                        maxLength: {
                          value: 50,
                          message: 'Name cannot exceed 50 characters',
                        },
                      })}
                      error={errors.name?.message}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Input
                      label="Email Address"
                      type="email"
                      value={user.email}
                      disabled
                      className="bg-surface/50"
                      helperText="Email cannot be changed"
                    />
                  </div>

                  <div>
                    <Input
                      label="Phone Number"
                      type="tel"
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Please enter a valid 10-digit phone number',
                        },
                      })}
                      error={errors.phone?.message}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <Input
                      label="Role"
                      type="text"
                      value={user.role}
                      disabled
                      className="bg-surface/50"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="min-w-[120px]"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" className="mr-2" />
                          Updating...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-2" />
                          Update Profile
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
