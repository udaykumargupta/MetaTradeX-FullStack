import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import { useNavigate } from "react-router-dom";

// A simple SVG icon for the email input field
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-5 w-5 text-gray-400"
  >
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

// A simple SVG spinner for the loading state
const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const ForgotPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        sendTo: data.email,
        verificationType: "EMAIL",
      };

      await axios.post(
        `${API_BASE_URL}/auth/password/send-otp`,
        requestBody
      );
      
      console.log("OTP sent successfully!");
      navigate("/reset-password"); 

    } catch (err) {
      console.error("Failed to send OTP:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // This outer div centers the form on the page
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* This div acts as the styled form container/card */}
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Forgot Your Password?</h1>
          <p className="text-sm text-gray-400 mt-2">
            No problem. Enter your email below and we'll send you an OTP to reset it.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <MailIcon />
                      </span>
                      <Input
                        className="w-full border border-gray-700 bg-gray-900/50 rounded-md py-5 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 transition-all"
                        placeholder="Enter your email"
                        type="email"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}

            <Button type="submit" className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors duration-300 flex items-center justify-center gap-2" disabled={loading}>
              {loading ? <Spinner/> : 'Send OTP'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
