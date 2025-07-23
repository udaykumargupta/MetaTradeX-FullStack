import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerifiedIcon } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AccountVerificationForm from "./AccountVerificationForm"; // Make sure path is correct
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getUser } from "@/State/Auth/Action"; // Assuming you have this action

const Profile = () => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false); // State to control the dialog

  // STEP 1: Send the OTP to the user's email
  const handleEnableTwoStepVerification = async () => {
    try {
      const token = localStorage.getItem("jwt");
      await axios.post(
        "http://localhost:5454/api/users/verification/EMAIL/send-otp",
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
        `http://localhost:5454/api/users/enable-two-factor/verify-otp/${otp}`,
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
              
              {/* Change 'isEnabled' to 'enabled' in this line */}
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
              <div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleEnableTwoStepVerification} disabled={auth.user?.twoFactorAuth?.isEnabled}>
                      {auth.user?.twoFactorAuth?.isEnabled ? "2FA Enabled" : "Enable Two Step Verification"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Verify your account</DialogTitle>
                    </DialogHeader>
                    <AccountVerificationForm onSubmit={handleVerifyOtp} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;