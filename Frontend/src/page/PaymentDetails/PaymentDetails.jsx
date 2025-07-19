import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PaymentDetailsform from "./PaymentDetailsform";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPaymentDetails, getPaymentDetails } from "@/State/Withdrawal/Action";

const PaymentDetails = () => {
  const { withdrawal } = useSelector((store) => store);
  const dispatch = useDispatch();
  // 1. State to control the dialog's open/closed status
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
  }, []);

  // 2. This function receives the data from the form and handles the logic
  const handleFormSubmit = (paymentDetails) => {
    dispatch(addPaymentDetails({
      paymentDetails,
      jwt: localStorage.getItem("jwt")
    }));
    // 3. Close the dialog after the action is dispatched
    setOpen(false);
  };

  return (
    <div className="px-20">
      <h1 className="text-3xl font-bold py-10">Payment Details</h1>
      {withdrawal.paymentDetails ? (
        <Card>
          <CardHeader>
            <CardTitle>{withdrawal.paymentDetails.bankName}</CardTitle>
            <CardDescription>
              A/C No:{" "}
              {/* Safety check to prevent crash if account number is short */}
              {withdrawal.paymentDetails.accountNumber && withdrawal.paymentDetails.accountNumber.length > 4
                ? "*".repeat(withdrawal.paymentDetails.accountNumber.length - 4) +
                  withdrawal.paymentDetails.accountNumber.slice(-4)
                : withdrawal.paymentDetails.accountNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <p className="w-32"> A/C Holder</p>
              <p className="text-gray-400">
                : {withdrawal.paymentDetails.accountHolderName}
              </p>
            </div>
            <div className="flex items-center">
              <p className="w-32">IFSC Code</p>
              <p className="text-gray-400">: {withdrawal.paymentDetails.ifsc}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        // 4. The Dialog is now controlled by the 'open' state
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="py-6">Add payment Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Details</DialogTitle>
            </DialogHeader>
            {/* 5. Pass the submission handler function to the form */}
            <PaymentDetailsform onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PaymentDetails;