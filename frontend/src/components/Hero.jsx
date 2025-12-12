import React from 'react';
import { FileText, BookOpen, Scale, Users, Search, Lightbulb } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      icon: FileText,
      title: '156K+ Legal Records',
      description: 'Comprehensive database of Indian legal documents',
    },
    {
      icon: BookOpen,
      title: 'NVIDIA Llama 3.1 70B',
      description: 'Powered by advanced AI for accurate legal insights',
    },
    {
      icon: Scale,
      title: 'Multi-Domain Coverage',
      description: 'Property, Criminal, Family, Corporate & more',
    },
    {
      icon: Search,
      title: 'Hybrid Search',
      description: 'Vector + BM25 for precise document retrieval',
    },
    {
      icon: Users,
      title: 'Multi-Language',
      description: 'English, Hindi, Tamil support',
    },
    {
      icon: Lightbulb,
      title: 'Free & Fast',
      description: 'Instant responses with zero cost',
    },
  ];

  return (
    <section className="py-16 px-6 bg-background dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-container mx-auto">
        {/* Hero Text */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl section-heading mb-6 leading-tight">
            ⚖️ Indian Legal Assistant
          </h1>
          <p className="max-w-hero mx-auto text-lg text-primary-textSecondary dark:text-gray-400">
            156K+ Legal Records • NVIDIA Llama 3.1 70B • Free & Fast
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary-text/5 dark:bg-gray-100/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary-text dark:text-gray-100" />
                  </div>
                  <div>
                    <h3 className="section-heading text-lg mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-primary-textSecondary dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;

