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

const PaymentDetailsform = ({ onSubmit }) => {
  const form = useForm({
    defaultValues: {
      accountHolderName: "",
      ifsc: "",
      accountNumber: "",
      confirmAccountNumber: "",
      bankName: "",
    },
  });

  // This function takes the form data and passes it up to the parent component.
  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  return (
    <div className="px-10 py-2">
      <Form {...form}>
        {/* The form now calls the correct handleFormSubmit function */}
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="accountHolderName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Holder Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ifsc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IFSC Code</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="accountNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmAccountNumber"
            // This rule validates that the account numbers match
            rules={{
              validate: (value) =>
                value === form.getValues("accountNumber") || "Account numbers do not match."
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Account Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bankName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bank Name</FormLabel>
                <FormControl>
                  <Input {...field} />
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