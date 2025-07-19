import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { useForm } from "react-hook-form";
import PropTypes from 'prop-types';
// This component's only job is to get the OTP and pass it up to the parent.
// It receives the `onSubmit` function as a prop from Profile.jsx
const AccountVerificationForm = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: {
      otp: "",
    },
  });

  // When this form's button is clicked, it calls the function from the parent
  const handleSubmit = (data) => {
    onSubmit(data.otp);
  };

  return (
    <div>
      <p className="text-center pb-5">Enter the OTP sent to your email.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border w-full border-gray-700 py-5"
                    placeholder="Enter 6-digit OTP"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full py-5">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
AccountVerificationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
};
export default AccountVerificationForm;