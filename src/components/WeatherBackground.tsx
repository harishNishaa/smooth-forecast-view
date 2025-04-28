
import React from 'react';

const WeatherBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-200/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-100/30 to-transparent" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-[10%] w-40 h-40 rounded-full bg-gradient-to-tr from-blue-200 to-blue-100 blur-3xl animate-pulse-slow" />
        <div className="absolute top-20 right-[15%] w-60 h-60 rounded-full bg-gradient-to-tr from-blue-100 to-white blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-[20%] w-80 h-80 rounded-full bg-gradient-to-tr from-blue-50 to-white blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};

export default WeatherBackground;
