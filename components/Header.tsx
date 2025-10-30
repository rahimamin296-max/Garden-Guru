
import React from 'react';
import { PlantIcon } from './icons/PlantIcon';

const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="flex items-center justify-center gap-4">
        <PlantIcon className="w-10 h-10 text-green-400" />
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">
          Garden Guru
        </h1>
      </div>
      <p className="mt-3 text-lg text-gray-400">
        Your AI-powered guide to a thriving garden.
      </p>
    </header>
  );
};

export default Header;
