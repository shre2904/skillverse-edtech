import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { coursesAPI, paymentsAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  StarIcon, 
  ClockIcon, 
  UserGroupIcon,
  PlayIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  HeartIcon,
  BookOpenIcon
} from '@heroicons/react/24/solid';
import { 
  HeartIcon as HeartOutlineIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { data: courseData, isLoading, error } = useQuery(
    ['course', id],
    () => coursesAPI.getCourseById(id),
    {
      enabled: !!id,
    }
  );

  const course = courseData?.course;

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please login to enroll in courses');
      return;
    }

    if (course.isEnrolled) {
      // Redirect to course content
      return;
    }

    setIsEnrolling(true);
    try {
      const response = await paymentsAPI.createOrder(course._id);
      if (response.success) {
        // Initialize Razorpay
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: response.order.amount,
          currency: response.order.currency,
          name: 'SkillVerse',
          description: course.title,
          order_id: response.order.id,
          handler: async (paymentResponse) => {
            try {
              const verifyResponse = await paymentsAPI.verifyPayment(
                response.order.id,
                paymentResponse.razorpay_payment_id,
                paymentResponse.razorpay_signature
              );
              
              if (verifyResponse.success) {
                toast.success('Enrollment successful!');
                window.location.reload();
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone,
          },
          theme: {
            color: '#2563eb',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to create payment order');
    } finally {
      setIsEnrolling(false);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h2>
          <p className="text-secondary-300 mb-4">The course you're looking for doesn't exist.</p>
          <Link to="/courses">
            <Button>Browse Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <Card className="bg-secondary-800 border-secondary-600">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-primary-400 bg-primary-500/20 px-2 py-1 rounded">
                      {course.category}
                    </span>
                    <span className="text-sm font-medium text-secondary-300 bg-secondary-700 px-2 py-1 rounded">
                      {course.level}
                    </span>
                    {course.isFeatured && (
                      <span className="text-sm font-medium text-accent-400 bg-accent-500/20 px-2 py-1 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
                  <p className="text-lg text-secondary-300">{course.description}</p>
                </div>

                <div className="flex items-center space-x-6 text-sm text-secondary-300 mb-4">
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-accent-500" />
                    <span>{typeof course.rating === 'object' ? course.rating.average?.toFixed(1) : course.rating || '4.5'}</span>
                    <span>({typeof course.rating === 'object' ? course.rating.count : '0'} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <UserGroupIcon className="h-4 w-4" />
                    <span>{course.enrollmentCount} students</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <img
                    src={course.instructor.avatar || '/default-avatar.png'}
                    alt={course.instructor.name}
                    className="h-10 w-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-foreground">Instructor</p>
                    <p className="text-sm text-secondary-300">{course.instructor.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            <Card className="bg-secondary-800 border-secondary-600">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.learningOutcomes?.map((outcome, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircleIcon className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-300">{outcome}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Curriculum */}
            <Card className="bg-secondary-800 border-secondary-600">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Course Curriculum</h2>
                <div className="space-y-4">
                  {course.lessons?.map((lesson, index) => (
                    <div key={lesson._id} className="flex items-center justify-between p-4 border border-secondary-600 rounded-lg bg-secondary-700">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {course.isEnrolled ? (
                            <PlayIcon className="h-5 w-5 text-primary-500" />
                          ) : (
                            <div className="h-5 w-5 border-2 border-secondary-400 rounded-full"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{lesson.title}</h3>
                          <p className="text-sm text-secondary-300">{lesson.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-secondary-300">
                        <ClockIcon className="h-4 w-4" />
                        <span>{formatDuration(lesson.duration)}</span>
                        {lesson.isFree && (
                          <span className="text-primary-500 font-medium">Free</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card className="bg-secondary-800 border-secondary-600">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements?.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <ArrowRightIcon className="h-4 w-4 text-secondary-400 mt-1 flex-shrink-0" />
                      <span className="text-secondary-300">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            {course.reviews?.length > 0 && (
              <Card className="bg-secondary-800 border-secondary-600">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Student Reviews</h2>
                  <div className="space-y-4">
                    {course.reviews.slice(0, 5).map((review) => (
                      <div key={review._id} className="border-b border-secondary-600 pb-4 last:border-b-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <img
                            src={review.user.avatar || '/default-avatar.png'}
                            alt={review.user.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div>
                            <p className="font-medium text-foreground">{review.user.name}</p>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < review.rating ? 'text-accent-500' : 'text-secondary-400'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-secondary-300">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Card */}
            <Card className="sticky top-8 bg-secondary-800 border-secondary-600">
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button
                  onClick={toggleWishlist}
                  className="absolute top-2 right-2 p-2 bg-secondary-800 rounded-full shadow-md hover:bg-secondary-700 transition-colors"
                >
                  {isWishlisted ? (
                    <HeartIcon className="h-5 w-5 text-red-500" />
                  ) : (
                    <HeartOutlineIcon className="h-5 w-5 text-secondary-300" />
                  )}
                </button>
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold text-foreground">
                      {formatPrice(course.price)}
                    </span>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="text-lg text-secondary-400 line-through">
                        {formatPrice(course.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3"
                    onClick={handleEnroll}
                    loading={isEnrolling}
                    disabled={isEnrolling}
                  >
                    Enroll Now - ₹{course?.price || 0}
                  </Button>
                  
                  {/* Add this new button for learning module */}
                  <Button 
                    onClick={() => navigate(`/learning/${course?._id}/1`)}
                    variant="outline"
                    className="flex items-center space-x-2 border-primary-500 text-primary-400 hover:bg-primary-600/10"
                  >
                    <BookOpenIcon className="h-5 w-5" />
                    <span>Start Learning Module</span>
                  </Button>
                </div>

                <div className="space-y-3 text-sm text-secondary-300 mt-6">
                  <div className="flex items-center justify-between">
                    <span>Course includes:</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-primary-500" />
                      <span>{course.lessons?.length || 0} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-primary-500" />
                      <span>{formatDuration(course.duration)} of content</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-primary-500" />
                      <span>Lifetime access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-primary-500" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-primary-500" />
                      <span>Mobile and desktop access</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card className="bg-secondary-800 border-secondary-600">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Instructor</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={course.instructor.avatar || '/default-avatar.png'}
                    alt={course.instructor.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-foreground">{course.instructor.name}</p>
                    <p className="text-sm text-secondary-300">Instructor</p>
                  </div>
                </div>
                <p className="text-sm text-secondary-300">
                  Expert instructor with years of experience in {course.category.toLowerCase()}.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
