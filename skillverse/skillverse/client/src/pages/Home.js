import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { coursesAPI } from '../services/api';
import { 
  AcademicCapIcon, 
  StarIcon, 
  UserGroupIcon, 
  ClockIcon,
  PlayIcon,
  ArrowRightIcon,
  
} from '@heroicons/react/24/solid';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await coursesAPI.getFeaturedCourses();
        if (response.success) {
          setFeaturedCourses(response.courses);
        }
      } catch (error) {
        console.error('Error fetching featured courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  const features = [
    {
      icon: AcademicCapIcon,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of experience'
    },
    {
      icon: PlayIcon,
      title: 'AR/VR Content',
      description: 'Immersive learning experiences with cutting-edge technology'
    },
    {
      icon: UserGroupIcon,
      title: 'Community Learning',
      description: 'Connect with fellow learners and collaborate on projects'
    },
    {
      icon: ClockIcon,
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with lifetime access to courses'
    }
  ];

  const categories = [
    { name: 'Programming', count: '50+ Courses', color: 'bg-primary-500' },
    { name: 'Design', count: '30+ Courses', color: 'bg-accent-500' },
    { name: 'Business', count: '25+ Courses', color: 'bg-primary-600' },
    { name: 'Engineering', count: '40+ Courses', color: 'bg-accent-600' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2 animate-pulse"></span>
                New: AI-Powered Learning
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Master new skills with our advanced{' '}
                <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                  EdTech platform
                </span>
            </h1>
              
              <p className="text-xl text-secondary-300 mb-8 leading-relaxed">
              Master new skills with our advanced EdTech platform featuring AR/VR content, 
              interactive courses, and personalized learning experiences.
            </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  as={Link} 
                  to="/courses"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Learning Free
                </Button>
                <Button 
                  as={Link} 
                  to="/about"
                  variant="outline"
                  className="border-primary-500 text-primary-400 hover:bg-primary-600/10 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>

              {/* Technology icons grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-primary-500/20 rounded-lg p-4 text-center group hover:bg-primary-500/30 transition-colors">
                  <div className="w-12 h-12 bg-primary-500 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AcademicCapIcon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-foreground">AI Learning</p>
                </div>
                <div className="bg-accent-500/20 rounded-lg p-4 text-center group hover:bg-accent-500/30 transition-colors">
                  <div className="w-12 h-12 bg-accent-500 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <PlayIcon className="h-6 w-6 text-gray-900" />
                  </div>
                  <p className="text-sm font-medium text-foreground">AR/VR Content</p>
                </div>
                <div className="bg-primary-600/20 rounded-lg p-4 text-center group hover:bg-primary-600/30 transition-colors">
                  <div className="w-12 h-12 bg-primary-600 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Community</p>
                </div>
                <div className="bg-accent-600/20 rounded-lg p-4 text-center group hover:bg-accent-600/30 transition-colors">
                  <div className="w-12 h-12 bg-accent-600 rounded-full mx-auto mb-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ClockIcon className="h-6 w-6 text-gray-900" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Flexible</p>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-secondary-400 mb-4">Join 50,000+ learners worldwide</p>
                <div className="flex justify-center space-x-4 text-xs text-secondary-500">
                  <span> Expert Instructors</span>
                  <span> Lifetime Access</span>
                  <span> Mobile Learning</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Visual */}
            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-3xl p-8 backdrop-blur-sm border border-primary-500/30">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <PlayIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Immersive Learning Experience
                  </h3>
                  <p className="text-secondary-300">Immersive learning with AR/VR technology</p>
                </div>
                
                {/* Floating cards */}
                <div className="absolute -top-4 -left-4 bg-secondary-800 rounded-lg p-3 shadow-lg border border-secondary-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <AcademicCapIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">AI Learning</p>
                      <p className="text-xs text-secondary-400">Smart Content</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-secondary-800 rounded-lg p-3 shadow-lg border border-secondary-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center">
                      <PlayIcon className="h-4 w-4 text-gray-900" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">AR/VR Content</p>
                      <p className="text-xs text-secondary-400">Immersive</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary-500/20 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose SkillVerse?
            </h2>
            <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
              We provide the best learning experience with cutting-edge technology and expert instruction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-secondary-800 border-secondary-600">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-white" />
                </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                  {feature.title}
                </h3>
                  <p className="text-secondary-300">
                  {feature.description}
                </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
              Discover our most popular and highly-rated courses
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Remove the hardcoded Circuit Learning Module card */}
              {/* Remove the hardcoded Medical Learning Module card */}
              
              {/* Keep only the dynamic featured courses */}
              {featuredCourses.slice(0, 4).map((course) => (
                <Card key={course._id} className="group hover:shadow-lg transition-shadow bg-secondary-800 border-secondary-600">
                  <div className="relative">
                    <img
                      src={course.thumbnail || '/course-placeholder.jpg'}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 bg-accent-500 text-gray-900 px-2 py-1 rounded text-xs font-semibold">
                      Featured
                    </div>
                    {/* Add category badge */}
                    <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      {course.category}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-primary-400 font-medium">
                          {course.category}
                        </span>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-accent-500 fill-current" />
                        <span className="text-sm text-secondary-300 ml-1">
                          {typeof course.rating === 'object' ? course.rating.average?.toFixed(1) || '4.8' : course.rating || '4.8'}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary-400 transition-colors">
                        {course.title}
                      </h3>
                    <p className="text-secondary-300 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-sm text-secondary-400">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        <span>{course.duration} weeks</span>
                        </div>
                      <div className="flex items-center text-sm text-secondary-400">
                        <UserGroupIcon className="h-4 w-4 mr-1" />
                        <span>{course.enrollmentCount} students</span>
                      </div>
                    </div>
                      <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl font-bold text-foreground">
                          ₹{course.price?.toLocaleString() || '0'}
                          </span>
                          {course.originalPrice && course.originalPrice > course.price && (
                          <span className="text-lg text-secondary-400 line-through ml-2">
                            ₹{course.originalPrice?.toLocaleString()}
                            </span>
                          )}
                      </div>
                    </div>
                    <Button 
                      as={Link} 
                      to={`/courses/${course._id}`}
                      className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white transition-colors"
                    >
                      View Course
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              as={Link} 
              to="/courses"
              className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
                View All Courses
              <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-secondary-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore Categories
            </h2>
            <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
              Find courses in your area of interest
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/courses?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <Card className="text-center p-8 hover:shadow-lg transition-all duration-300 transform hover:scale-105 bg-secondary-800 border-secondary-600 group-hover:border-primary-500/50">
                  <div className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <AcademicCapIcon className="h-8 w-8 text-white" />
                </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary-400 transition-colors">
                  {category.name}
                </h3>
                  <p className="text-secondary-400 text-sm">
                  {category.count}
                </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students who are already learning with SkillVerse
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              as={Link} 
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
                Get Started Free
              </Button>
            <Button 
              as={Link} 
              to="/courses"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300"
            >
                Browse Courses
              </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;