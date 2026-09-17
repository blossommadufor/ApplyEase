import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faFileArrowUp, faSquareCheck } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

const features = [
    {
      step: "01",
      icon: faUserPlus,
      title: "Create Account",
      text: "Register with your email and select your target program or institution category.",
    },
    {
      step: "02",
      icon: faFileArrowUp,
      title: "Submit Details",
      text: "Fill out the step-by-step application form and upload your academic credentials seamlessly.",
    },
    {
      step: "03",
      icon: faSquareCheck,
      title: "Track & Get Admitted",
      text: "Monitor your real-time admission status and receive instant updates directly on your dashboard.",
    },
];

const Features = () => {
  return (
    <div className="px-6 lg:px-16 py-20 bg-gray-400">

    <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold text-primary-hover">How ApplyEase Works</h2>
        <p className="text-text-primary mt-2 text-sm sm:text-base">
          Get started with your academic application in three straightforward steps.
        </p>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {
                features.map((item, index) => (
                    <div 
                        key={index}
                        className="bg-bgLight p-8 rounded-xl shadow-sm border border-[#DCE1E7] flex flex-col justify-between hover:shadow-md transition"
                    >
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-customBg border border-primary text-primary rounded-lg flex items-center justify-center text-xl">
                                <FontAwesomeIcon icon={item.icon} />
                            </div>
                            <h3 className="text-xl font-bold text-[#1F2430]">{item.title}</h3>
                            <p className="text-[#8B93A1] text-sm leading-relaxed">{item.text}</p>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  );
};

export default Features;