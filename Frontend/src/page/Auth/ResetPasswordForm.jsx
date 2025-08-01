import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom"; // For routing
import { API_BASE_URL } from "@/config/api";

const ResetPasswordForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // To redirect after success

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

      await axios.post(
        `${API_BASE_URL}/auth/password/reset`,
        requestBody
      );
      
      console.log("Password has been reset successfully!");
      navigate("/password-success"); // Redirect to a success page

    } catch (err) {
      console.error("Failed to reset password:", err);
      setError(err.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center pb-3">Reset Password</h1>
      <p className="text-center text-sm text-gray-400 pb-5">
        Enter the OTP from your email and your new password.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border w-full border-gray-700 py-5"
                    placeholder="Enter OTP"
                    {...field}
                  />
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
                  <Input
                    className="border w-full border-gray-700 py-5"
                    placeholder="Enter new password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full py-5" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;