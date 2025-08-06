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
import { PencilIcon } from "lucide-react";

const PaymentDetails = () => {
  const { withdrawal } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getPaymentDetails({ jwt: localStorage.getItem("jwt") }));
  }, []);

  // <-- MODIFIED: This function is now async to handle the update correctly -->
  const handleFormSubmit = async (paymentDetails) => {
    const token = localStorage.getItem("jwt");
    
    // 1. Wait for the add/update action to complete
    await dispatch(addPaymentDetails({ paymentDetails, jwt: token }));
    
    // 2. Dispatch the action to get the fresh, updated details
    dispatch(getPaymentDetails({ jwt: token }));
    
    // 3. Close the dialog
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="px-20">
        <h1 className="text-3xl font-bold py-10">Payment Details</h1>
        {withdrawal.paymentDetails ? (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{withdrawal.paymentDetails.bankName}</CardTitle>
                  <CardDescription>
                    A/C No:{" "}
                    {withdrawal.paymentDetails.accountNumber &&
                    withdrawal.paymentDetails.accountNumber.length > 4
                      ? "*".repeat(
                          withdrawal.paymentDetails.accountNumber.length - 4
                        ) +
                        withdrawal.paymentDetails.accountNumber.slice(-4)
                      : withdrawal.paymentDetails.accountNumber}
                  </CardDescription>
                </div>
                <DialogTrigger>
                  <Button variant="outline" size="icon">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
              </div>
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
                <p className="text-gray-400">
                  : {withdrawal.paymentDetails.ifsc}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DialogTrigger asChild>
            <Button className="py-6">Add payment Details</Button>
          </DialogTrigger>
        )}
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {withdrawal.paymentDetails ? "Edit Payment Details" : "Add Payment Details"}
            </DialogTitle>
          </DialogHeader>
          <PaymentDetailsform
            initialData={withdrawal.paymentDetails}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default PaymentDetails;