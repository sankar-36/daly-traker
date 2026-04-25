import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#191b22] font-sans">
      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-32 max-w-7xl mx-auto overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Text Content */}
          <div className="lg:col-span-7 z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold tracking-widest uppercase mb-6">
              Redefining Productivity
            </span>
            <h1 className="font-bold text-5xl lg:text-7xl leading-[1.1] text-[#00327d] tracking-tight mb-8">
              Master Your Daily Routine <span className="text-[#0047ab]">& Excel</span> in Your Typing.
            </h1>
            <p className="text-lg text-gray-600 max-w-xl mb-10 leading-relaxed">
              Improve your typing speed, track your WPM in real-time, and analyze errors with precision. 
              Built for students and professionals who value speed and accuracy.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/register" 
                className="px-8 py-4 bg-[#00327d] text-white rounded-xl font-bold text-lg hover:scale-95 transition-all shadow-lg flex items-center gap-2"
              >
                Get Started for Free
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-4 bg-white text-[#00327d] border border-blue-100 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors"
              >
                Login to Dashboard
              </Link>
            </div>
          </div>

          {/* Right Side: Visual Element */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl bg-white relative group">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Typing Practice" 
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
              
              {/* Floating Status Card */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#00327d]">Typing Accuracy</span>
                  <span className="text-xs font-bold text-green-600">98% Perfect</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <h2 className="font-bold text-4xl text-[#00327d] mb-4">Powerful Features</h2>
            <p className="text-gray-600">Everything you need to become a typing master in one place.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-blue-600 mb-4 font-bold text-4xl">01</div>
              <h3 className="text-xl font-bold mb-2">Real-time WPM</h3>
              <p className="text-gray-600">Watch your speed grow as you type with our live Words Per Minute calculator.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-blue-600 mb-4 font-bold text-4xl">02</div>
              <h3 className="text-xl font-bold mb-2">Error Tracking</h3>
              <p className="text-gray-600">Our smart algorithm highlights mistakes instantly so you can fix your technique.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="text-blue-600 mb-4 font-bold text-4xl">03</div>
              <h3 className="text-xl font-bold mb-2">Progress Analytics</h3>
              <p className="text-gray-600">Visualize your improvement over time with detailed charts and history.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;