import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOtp } from "@/State/Auth/Action";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// SVG icon for the OTP input field
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

// SVG spinner for the loading state
const Spinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const TwoFactorAuthForm = () => {
  const { sessionId, loading, error } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: { otp: "" },
    // You can add validation here if needed
    // resolver: yupResolver(schema),
  });

  const onSubmit = ({ otp }) => {
    dispatch(verifyOtp({ otp, id: sessionId, navigate }));
  };

  return (
    // This outer div centers the form on the page
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      {/* This div acts as the styled form container/card */}
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Two-Factor Authentication</h1>
          <p className="text-sm text-gray-400 mt-2">
            Please enter the 6-digit code sent to your email to continue.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockIcon />
                      </span>
                      <Input
                        className="w-full border border-gray-700 bg-gray-900/50 rounded-md py-5 pl-10 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500 transition-all"
                        placeholder="Enter OTP"
                        type="text"
                        maxLength={6}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}
            <Button
              type="submit"
              className="w-full py-5 bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors duration-300 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? <Spinner/> : 'Verify OTP'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TwoFactorAuthForm;
