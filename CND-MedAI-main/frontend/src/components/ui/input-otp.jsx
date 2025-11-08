import * as React from "react";
import { Dot } from "lucide-react";

import { cn } from "../../utils/cn";

// Note: depends on an OTPInput component/package (left as-is)
const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)} {...props} />
));
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center", className)} {...props} />);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  // Placeholder simple slot rendering
  return (
    <div ref={ref} className={cn("relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md", className)} {...props} />
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef((props, ref) => (
  <div ref={ref} role="separator" {...props}>
    <Dot />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
