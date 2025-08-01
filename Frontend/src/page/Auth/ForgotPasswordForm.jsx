import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios"; // Make sure to install axios: npm install axios
import { API_BASE_URL } from "@/config/api";

const ForgotPasswordForm = () => {
  // State for handling loading, success, and error messages
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    // You should define defaultValues, not defaultValue
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // The request body must match your ForgotPasswordTokenRequest DTO
      const requestBody = {
        sendTo: data.email,
        verificationType: "EMAIL", // This is for password reset via email
      };

      // Replace with your actual backend API URL
      const response = await axios.post(
        `${API_BASE_URL}/auth/password/send-otp`,
        requestBody
      );
      
      console.log("Response:", response.data);
      setSuccess(true);

    } catch (err) {
      console.error("Failed to send OTP:", err);
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold pb-3">Email Sent!</h1>
        <p>A password reset link has been sent to your email address if it is registered with us.</p>
      </div>
    );
  }

  return (
    <div className="">
      <h1 className="text-xl font-bold text-center pb-3">Forgot Password</h1>
      <p className="text-center text-sm text-gray-400 pb-5">
        Enter your email and we'll send you an OTP to reset your password.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border w-full border-gray-700 py-5"
                    placeholder="enter your email"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full py-5" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Email"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;