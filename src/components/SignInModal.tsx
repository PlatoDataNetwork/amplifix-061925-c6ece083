
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, Mail, Lock } from "lucide-react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just log the form data and close modal
    console.log('Sign in form submitted:', formData);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#121218] border border-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#8A3FFC] focus:outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#8A3FFC] focus:outline-none"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-400">Remember me</span>
            </label>
            <button type="button" className="text-[#8A3FFC] hover:underline">
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity mt-6"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{' '}
          <button className="text-[#8A3FFC] hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInModal;
