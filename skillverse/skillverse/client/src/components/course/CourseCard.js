import React from 'react';
import { Link } from 'react-router-dom';
import { StarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/solid';
import { Card, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

const CourseCard = ({ 
  course, 
  onEnroll, 
  showEnrollButton = true 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  const formatDuration = (duration) => {
    if (duration < 60) {
      return `${duration} min`;
    }
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  };

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {course.isFeatured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Featured
          </div>
        )}
        {course.originalPrice && course.originalPrice > course.price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded">
              {course.category}
            </span>
            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {course.level}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {course.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <span>{course.rating.average.toFixed(1)}</span>
              <span>({course.rating.count})</span>
            </div>
            <div className="flex items-center space-x-1">
              <ClockIcon className="h-4 w-4" />
              <span>{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <UserGroupIcon className="h-4 w-4" />
              <span>{course.enrollmentCount}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(course.price)}
              </span>
              {course.originalPrice && course.originalPrice > course.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <img
              src={course.instructor.avatar || '/default-avatar.png'}
              alt={course.instructor.name}
              className="h-6 w-6 rounded-full"
            />
            <span>By {course.instructor.name}</span>
          </div>

          {showEnrollButton && (
            <div className="flex space-x-2">
              <Link to={`/courses/${course._id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
              {!course.isEnrolled && onEnroll && (
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onEnroll(course._id)}
                >
                  Enroll Now
                </Button>
              )}
              {course.isEnrolled && (
                <Link to={`/courses/${course._id}`} className="flex-1">
                  <Button size="sm" className="w-full">
                    Continue Learning
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
