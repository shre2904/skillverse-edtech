import React from 'react';
import { Link } from 'react-router-dom';
import { 
  AcademicCapIcon, 
  PlayIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/solid';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const About = () => {
  const teamMembers = [
    {
      name: "Sumanshu Nagpal",
      position: "Chief Executive Officer",
      description: "Founder and chief visionary, Sumanshu is the driving force behind the company. He loves to keep his hands full by participating in the development of the software, marketing, and customer experience strategies.",
      avatar: ""
    },
    {
      name: "Shresth Kakkar",
      position: "Product Manager",
      description: "Shresth shapes the vision of Skillverse modules, aligning learner needs with innovative AR/VR solutions. Shresth ensures every course is engaging, practical, and built to deliver real-world impact.",
      avatar: ""
    },
    {
      name: "Uday Aggarwal",
      position: "Chief Technology Officer",
      description: "Uday is the tech backbone of Skillverse, leading AR/VR innovation and development. With a focus on cutting-edge tools and seamless integration, Uday ensures the platform delivers scalable and immersive learning experiences.",
      avatar: ""
    },
    {
      name: "Sukriti",
      position: "Chief Operations Officer",
      description: "Sukriti oversees daily operations at Skillverse, ensuring smooth execution from development to delivery. With a focus on efficiency and collaboration, Sukriti keeps the team aligned to achieve impactful results.",
      avatar: ""
    },
    {
      name: "Simran Dhiman",
      position: "Marketing & Sales Head",
      description: "Simran drives Skillverse's growth by developing strategic marketing campaigns and leading sales efforts. With a keen understanding of the market and audience, Simran ensures our platform reaches the right users effectively.",
      avatar: ""
    },
    {
      name: "Sunidhi Minhas",
      position: "UI/UX Designer",
      description: "Sunidhi crafts intuitive and engaging interfaces for Skillverse. With a user-first approach, Sunidhi ensures every interaction feels seamless, enhancing the overall learning experience.",
      avatar: ""
    }
  ];

  const usefulLinks = [
    { name: 'Home', href: '/' },
    { name: 'About us', href: '/about' },
    { name: 'Products', href: '/courses' },
    { name: 'Services', href: '/services' },
    { name: 'Legal', href: '/legal' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Help', href: '/help' },
    { name: 'Contact us', href: '/contact' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-foreground">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About us
            </h1>
          </div>
        </div>
      </section>

      {/* Enhance Your Experience Section */}
      <section className="py-20 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Enhance Your <span className="text-accent-500">Experience</span>
              </h2>
              <p className="text-lg text-secondary-300 mb-8 leading-relaxed">
                "Skillverse transforms traditional learning into an immersive journey. By combining AR and VR, it creates lifelike simulations where learners can practice skills safely and effectively.
              </p>
              <p className="text-lg text-secondary-300 mb-8 leading-relaxed">
                Our platform enhances engagement, boosts retention, and makes complex topics easier to understand. With smart guidance and real-time progress tracking, Skillverse ensures every learner experiences education like never before."
              </p>
              <Link to="/courses">
                <Button size="lg" className="bg-accent-500 text-gray-900 hover:bg-accent-600">
                  Learn more
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-primary-500 rounded-full flex items-center justify-center">
                <PlayIcon className="h-32 w-32 text-gray-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Discover New Opportunities Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="w-80 h-80 bg-accent-500 rounded-full flex items-center justify-center mx-auto">
                <AcademicCapIcon className="h-32 w-32 text-gray-900" />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Discover New <span className="text-primary-500">Opportunities</span>
              </h2>
              <p className="text-lg text-secondary-300 mb-8 leading-relaxed">
                "Skillverse opens doors to endless opportunities by bridging learning with real-world applications. From mastering industry-relevant skills to exploring futuristic AR/VR experiences.
              </p>
              <p className="text-lg text-secondary-300 mb-8 leading-relaxed">
                Learners can unlock new career paths and innovations. With every module, Skillverse empowers users to discover, grow, and shape their future in a rapidly evolving world."
              </p>
              <Link to="/courses">
                <Button size="lg" className="bg-primary-500 text-gray-900 hover:bg-primary-600">
                  Learn more
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy Section */}
      <section className="py-20 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            <span className="text-accent-500">Everything is designed.</span>
          </h2>
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            <span className="text-primary-500">Few things are designed well.</span>
          </h3>
        </div>
      </section>

      {/* Meet Our Team Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet our team
            </h2>
            <p className="text-xl text-secondary-300">
              Dedicated professionals driving our success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="mb-6">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="h-24 w-24 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary-500 font-medium mb-4">
                      {member.position}
                    </p>
                    <p className="text-secondary-300 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Links Section */}
      <section className="py-20 bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Useful Links */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Useful Links
              </h3>
              <ul className="space-y-2">
                {usefulLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-secondary-400 hover:text-accent-500 transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                About us
              </h3>
              <p className="text-secondary-300 mb-4">
                We are a team of passionate people whose goal is to improve everyone's life through Educating that is the need.
              </p>
              <p className="text-secondary-300">
                Our Website is designed for Making the Study Practical and Accessible to Everyone.
              </p>
            </div>

            {/* Connect with us */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Connect with us
              </h3>
              <ul className="space-y-2 text-secondary-300">
                <li className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-primary-500" />
                  Contact us
                </li>
                <li className="flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-primary-500" />
                  Skillverse.com
                </li>
                <li className="flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-primary-500" />
                  +91 86452 6472
                </li>
              </ul>
            </div>

            {/* Follow us */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Follow us
              </h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" className="text-secondary-400 hover:text-accent-500 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" className="text-secondary-400 hover:text-accent-500 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" className="text-secondary-400 hover:text-accent-500 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 