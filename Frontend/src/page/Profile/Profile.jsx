import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifiedIcon } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AccountVerificationForm from "./AccountVerificationForm"; // Make sure path is correct
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { disableTwoFactorAuth, getUser } from "@/State/Auth/Action"; // Assuming you have this action
import { API_BASE_URL } from "@/config/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Profile = () => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false); // State to control the dialog

  // STEP 1: Send the OTP to the user's email
  const handleEnableTwoStepVerification = async () => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        `${API_BASE_URL}/api/users/verification/EMAIL/send-otp`,
        {}, // Empty body for this POST request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // If OTP is sent successfully, keep the dialog open
      setOpen(true);
    } catch (err) {
      console.error("Failed to send OTP", err);
    }
  };

  // STEP 2: Verify the OTP entered by the user
  const handleVerifyOtp = async (otp) => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.patch(
        `${API_BASE_URL}/api/users/enable-two-factor/verify-otp/${otp}`,
        {}, // Empty body for this PATCH request
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // After successful verification, refresh user data and close the dialog
      dispatch(getUser(token));
      setOpen(false);
    } catch (err) {
      console.error("Failed to verify OTP", err);
    }
  };
    const handleDisableTwoFactorAuth = async () => {
        const token = localStorage.getItem("jwt");

        // 1. Dispatch the disable action and wait for it to complete
        await dispatch(disableTwoFactorAuth(token));
        
        // 2. AFTER it succeeds, dispatch getUser to refresh the UI with the updated user data
        dispatch(getUser(token));
    };

  return (
    <div className="flex flex-col items-center mb-5">
      <div className="pt-10 w-full lg:w-[60%]">
        {/* Your Information Card - no changes needed here */}
        <Card>
          <CardHeader className="pb-9">
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Email:</p>
                  <p className="text-gray-500">{auth.user?.email}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">Full Name:</p>
                  <p className="text-gray-500">{auth.user?.fullName}</p>
                </div>
                {/* <div className="flex">
                  <p className="w-[9rem]">Date of Birth</p>
                  <p className="text-gray-500">11/04/2004</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">Nationality</p>
                  <p className="text-gray-500">Indian</p>
                </div> */}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card className="w-full">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>2 Step Verification</CardTitle>
                {auth.user?.twoFactorAuth?.enabled ? (
                  <Badge className={"space-x-2 text-white bg-green-600"}>
                    <VerifiedIcon />
                    <span>Enabled</span>
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500">Disabled</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {/* --- NEW: Conditional logic for the button --- */}
              <div>
                {auth.user?.twoFactorAuth?.enabled ? (
                  // If ENABLED, show the "Disable" button with a confirmation dialog
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Disable 2FA</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove an extra layer of security from your
                          account.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDisableTwoFactorAuth}>
                          Yes, Disable 2FA
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  // If DISABLED, show the original "Enable" button and dialog
                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleEnableTwoStepVerification}>
                        Enable Two Step Verification
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Verify your account</DialogTitle>
                      </DialogHeader>
                      <AccountVerificationForm onSubmit={handleVerifyOtp} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
