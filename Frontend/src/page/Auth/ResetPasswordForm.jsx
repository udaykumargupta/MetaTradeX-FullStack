import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

// --- SVG Icons for a better UI ---

const OTPSquareIcon = () => (
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
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M7 12h1.5l1.5 1.5V12H11" />
    <path d="M17 12h-2l-1 1.5v-1.5h-1.5" />
  </svg>
);

const LockIcon = () => (
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
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const SuccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-12 w-12 text-green-500 mx-auto mb-4"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      otp: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const requestBody = {
        otp: data.otp,
        password: data.password,
      };

      await axios.post(`${API_BASE_URL}/auth/password/reset`, requestBody);

      console.log("Password has been reset successfully!");
      setSuccess(true);

      setTimeout(() => {
        navigate("/signin");
      }, 3000);
    } catch (err) {
      console.error("Failed to reset password:", err);
      setError(
        err.response?.data?.message || "Invalid OTP or an error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        {success ? (
          <div className="text-center">
            <SuccessIcon />
            <h1 className="text-2xl font-bold pb-2 text-green-400">Success!</h1>
            <p className="text-gray-300">
              Your password has been reset. Redirecting to sign-in...
            </p>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">
                Reset Your Password
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Enter the OTP from your email and your new password.
              </p>
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <OTPSquareIcon />
                          </span>
                          <Input
                            className="w-full border border-gray-700 bg-gray-900/50 rounded-md py-5 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 transition-all"
                            placeholder="Enter OTP"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <LockIcon />
                          </span>
                          <Input
                            className="w-full border border-gray-700 bg-gray-900/50 rounded-md py-5 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 transition-all"
                            placeholder="Enter new password"
                            type="password"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <p className="text-red-400 text-sm text-center font-medium">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors duration-300 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Reset Password"}
                </Button>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
