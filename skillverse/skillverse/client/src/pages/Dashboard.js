import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { userAPI, coursesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpenIcon, 
  ClockIcon, 
  TrophyIcon,
  ChartBarIcon,
  PlayIcon,
  StarIcon,
  UserCircleIcon
} from '@heroicons/react/24/solid';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentCourses, setRecentCourses] = useState([]);

  const { data: enrolledData, isLoading: enrolledLoading } = useQuery(
    'enrolled-courses',
    () => userAPI.getEnrolledCourses(),
    {
      enabled: !!user,
    }
  );

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery(
    'analytics',
    () => userAPI.getAnalytics(),
    {
      enabled: !!user,
    }
  );

  const { data: featuredData } = useQuery(
    'featured-courses',
    () => coursesAPI.getFeaturedCourses()
  );

  useEffect(() => {
    if (featuredData?.courses) {
      setRecentCourses(featuredData.courses.slice(0, 3));
    }
  }, [featuredData]);

  const enrolledCourses = enrolledData?.enrolledCourses || [];
  const analytics = analyticsData?.analytics || {};

  if (enrolledLoading || analyticsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      name: 'Enrolled Courses',
      value: analytics.totalEnrolled || 0,
      icon: BookOpenIcon,
      color: 'text-primary-500',
      bgColor: 'bg-primary-500/20',
    },
    {
      name: 'Average Progress',
      value: `${Math.round(analytics.averageProgress || 0)}%`,
      icon: ChartBarIcon,
      color: 'text-accent-500',
      bgColor: 'bg-accent-500/20',
    },
    {
      name: 'Completed Courses',
      value: analytics.completedCourses || 0,
      icon: TrophyIcon,
      color: 'text-primary-600',
      bgColor: 'bg-primary-600/20',
    },
    {
      name: 'Learning Streak',
      value: '7 days',
      icon: ClockIcon,
      color: 'text-accent-600',
      bgColor: 'bg-accent-600/20',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-secondary-300 mt-2">
            Continue your learning journey and discover new courses.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-secondary-300">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Enrolled Courses */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground">
                  Your Enrolled Courses
                </h2>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpenIcon className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      No courses enrolled yet
                    </h3>
                    <p className="text-secondary-300 mb-4">
                      Start your learning journey by enrolling in a course.
                    </p>
                    <Link to="/courses">
                      <Button className="bg-accent-500 text-gray-900 hover:bg-accent-600">
                        Browse Courses
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 5).map((course) => (
                      <div key={course._id} className="flex items-center space-x-4 p-4 bg-secondary-800 rounded-lg">
                        <img
                          src={course.thumbnail || '/course-placeholder.jpg'}
                          alt={course.title}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-foreground truncate">
                            {course.title}
                          </h3>
                          <p className="text-sm text-secondary-300">
                            {course.category}
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-xs text-secondary-400">
                              <span>Progress: {course.progress || 0}%</span>
                              <span>{course.duration || '2h 30m'}</span>
                            </div>
                            <div className="mt-1 bg-secondary-700 rounded-full h-2">
                              <div
                                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${course.progress || 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <Link to={`/courses/${course._id}`}>
                          <Button size="sm" variant="outline" className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-gray-900">
                            Continue
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Courses & Quick Actions */}
          <div className="space-y-6">
            {/* Recent Courses */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground">
                  Recommended for You
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course._id} className="flex items-center space-x-3">
                      <img
                        src={course.thumbnail || '/course-placeholder.jpg'}
                        alt={course.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {course.title}
                        </h3>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-accent-500 fill-current" />
                          <span className="text-sm text-secondary-300 ml-1">
                            {typeof course.rating === 'object' ? course.rating.average?.toFixed(1) || '4.5' : course.rating || '4.5'}
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <span className="ml-2 text-xs text-secondary-400">
                            ₹{course.price || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/courses">
                    <Button variant="outline" className="w-full border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-gray-900">
                      View All Courses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground">
                  Quick Actions
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Link to="/profile">
                    <Button variant="outline" className="w-full justify-start border-secondary-600 text-secondary-300 hover:bg-secondary-700">
                      <UserCircleIcon className="h-4 w-4 mr-2" />
                      Update Profile
                    </Button>
                  </Link>
                  <Link to="/payments">
                    <Button variant="outline" className="w-full justify-start border-secondary-600 text-secondary-300 hover:bg-secondary-700">
                      <TrophyIcon className="h-4 w-4 mr-2" />
                      Payment History
                    </Button>
                  </Link>
                  <Link to="/courses">
                    <Button className="w-full justify-start bg-accent-500 text-gray-900 hover:bg-accent-600">
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Browse Courses
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
