import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useEffect } from "react"; // <-- Import useEffect

// <-- The component now accepts `initialData` for editing -->
const PaymentDetailsform = ({ onSubmit, initialData }) => {
  const form = useForm({
    // Default values are set here for a new form
    defaultValues: {
      accountHolderName: "",
      ifsc: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
    },
  });

  // <-- This useEffect hook pre-fills the form when editing -->
  useEffect(() => {
    // If initialData exists, reset the form with those values
    if (initialData) {
      form.reset({
        ...initialData,
        // Also pre-fill the confirmation field
        confirmAccountNumber: initialData.accountNumber || "",
      });
    }
  }, [initialData, form.reset]);

  // This function takes the validated form data and passes it up to the parent.
  const handleFormSubmit = (data) => {
    // We don't need confirmAccountNumber in the final submitted data
    const { confirmAccountNumber, ...paymentDetails } = data;
    onSubmit(paymentDetails);
  };

  return (
    <div className="px-10 py-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="accountHolderName"
            rules={{ required: "Account holder name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="John Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountNumber"
            rules={{ required: "Account number is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="1234567890" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmAccountNumber"
            rules={{
              required: "Please confirm your account number",
              // This rule validates that the account numbers match
              validate: (value) =>
                value === form.watch("accountNumber") ||
                "Account numbers do not match.",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Account Number</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="1234567890" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ifsc"
            rules={{ required: "IFSC code is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="SBIN0001234" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankName"
            rules={{ required: "Bank name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="State Bank of India" />
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

export default PaymentDetailsform;