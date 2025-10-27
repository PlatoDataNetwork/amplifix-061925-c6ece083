
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, Mail, Lock } from "lucide-react";
import { useJsonData } from "@/hooks/useJsonData";
import { AuthData } from "@/types/auth";
import { Skeleton } from "@/components/ui/skeleton";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SignInModal = ({ isOpen, onClose }: SignInModalProps) => {
  const { data: authData, isLoading } = useJsonData<AuthData>('auth.json');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  if (!isOpen) return null;

  if (isLoading || !authData) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#121218] border border-gray-800 rounded-xl p-8 max-w-md w-full mx-4">
          <Skeleton className="h-8 w-48 mb-6" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const signInText = authData.sign_in;

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
          <h2 className="text-2xl font-bold text-white">{signInText.title}</h2>
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
              {signInText.email_label}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#8A3FFC] focus:outline-none"
                placeholder={signInText.email_placeholder}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {signInText.password_label}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:border-[#8A3FFC] focus:outline-none"
                placeholder={signInText.password_placeholder}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-gray-400">{signInText.remember_me}</span>
            </label>
            <button type="button" className="text-[#8A3FFC] hover:underline">
              {signInText.forgot_password}
            </button>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8A3FFC] to-[#06B6D4] text-white hover:opacity-90 transition-opacity mt-6"
          >
            {signInText.submit_button}
          </Button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-4">
          {signInText.no_account}{' '}
          <button className="text-[#8A3FFC] hover:underline">
            {signInText.sign_up_link}
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignInModal;
