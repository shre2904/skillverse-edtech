import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { coursesAPI } from '../services/api';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level') || '',
    sort: searchParams.get('sort') || '',
    page: parseInt(searchParams.get('page')) || 1,
  });

  const { data: coursesData, isLoading, error } = useQuery(
    ['courses', filters],
    () => coursesAPI.getCourses(filters),
    {
      keepPreviousData: true,
    }
  );

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    
    // Update URL
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== '') {
        newSearchParams.set(k, v);
      }
    });
    setSearchParams(newSearchParams);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== '') {
        newSearchParams.set(k, v);
      }
    });
    setSearchParams(newSearchParams);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    'All',
    'Programming',
    'Design',
    'Business',
    'Engineering',
    'Science',
    'Arts',
    'Mathematics',
    'Language'
  ];

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'enrollment', label: 'Most Popular' },
  ];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Courses</h2>
          <p className="text-secondary-300 mb-4">Something went wrong while loading the courses.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">All Courses</h1>
          <p className="text-secondary-300">
            Discover and enroll in courses that match your learning goals
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Search Courses
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                      <input
                        type="text"
                        placeholder="Search courses..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-secondary-800 border border-secondary-600 rounded-md text-foreground placeholder-secondary-400 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Category
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-3 py-2 bg-secondary-800 border border-secondary-600 rounded-md text-foreground focus:ring-primary-500 focus:border-primary-500"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category === 'All' ? '' : category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Level
                    </label>
                    <select
                      value={filters.level}
                      onChange={(e) => handleFilterChange('level', e.target.value)}
                      className="w-full px-3 py-2 bg-secondary-800 border border-secondary-600 rounded-md text-foreground focus:ring-primary-500 focus:border-primary-500"
                    >
                      {levels.map((level) => (
                        <option key={level} value={level === 'All' ? '' : level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Sort By
                    </label>
                    <select
                      value={filters.sort}
                      onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="w-full px-3 py-2 bg-secondary-800 border border-secondary-600 rounded-md text-foreground focus:ring-primary-500 focus:border-primary-500"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        search: '',
                        category: '',
                        level: '',
                        sort: '',
                        page: 1,
                      });
                      setSearchParams({});
                    }}
                    className="w-full border-secondary-600 text-secondary-300 hover:bg-secondary-700"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Courses Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-secondary-300">
                    {coursesData?.total || 0} courses found
                  </p>
                  <div className="flex items-center space-x-2">
                    <FunnelIcon className="h-5 w-5 text-secondary-400" />
                    <span className="text-sm text-secondary-400">Filters Applied</span>
                  </div>
                </div>

                {/* Courses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {coursesData?.courses?.map((course) => (
                    <Card key={course._id} className="group hover:shadow-lg transition-shadow">
                      <div className="aspect-w-16 aspect-h-9 bg-secondary-800 rounded-t-lg overflow-hidden">
                        <img
                          src={course.thumbnail || '/course-placeholder.jpg'}
                          alt={course.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-primary-500">
                            {course.category}
                          </span>
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-accent-500 fill-current" />
                            <span className="ml-1 text-sm text-secondary-300">
                              {typeof course.rating === 'object' ? course.rating.average?.toFixed(1) || '4.5' : course.rating || '4.5'}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {course.title}
                        </h3>
                        
                        <p className="text-secondary-300 text-sm mb-4 line-clamp-3">
                          {course.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-secondary-400 mb-4">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {course.duration || '2h 30m'}
                          </div>
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {course.enrollmentCount || 0} students
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-foreground">
                            {course.price === 0 ? 'Free' : `₹${course.price}`}
                          </div>
                          <Link to={`/courses/${course._id}`}>
                            <Button size="sm" className="bg-accent-500 text-gray-900 hover:bg-accent-600">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {coursesData?.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(filters.page - 1)}
                        disabled={filters.page === 1}
                        className="border-secondary-600 text-secondary-300 hover:bg-secondary-700 disabled:opacity-50"
                      >
                        Previous
                      </Button>
                      
                      {Array.from({ length: coursesData.totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === filters.page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className={
                            page === filters.page
                              ? "bg-primary-500 text-gray-900 hover:bg-primary-600"
                              : "border-secondary-600 text-secondary-300 hover:bg-secondary-700"
                          }
                        >
                          {page}
                        </Button>
                      ))}
                      
                      <Button
                        variant="outline"
                        onClick={() => handlePageChange(filters.page + 1)}
                        disabled={filters.page === coursesData.totalPages}
                        className="border-secondary-600 text-secondary-300 hover:bg-secondary-700 disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
