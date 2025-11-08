import * as React from "react";
import { Drawer as VaulDrawer } from "vaul";

import { cn } from "../../utils/cn";

const Drawer = ({ shouldScaleBackground = true, ...props }) => <VaulDrawer.Root shouldScaleBackground={shouldScaleBackground} {...props} />;
Drawer.displayName = "Drawer";

const DrawerTrigger = VaulDrawer.Trigger;
const DrawerPortal = VaulDrawer.Portal;
const DrawerClose = VaulDrawer.Close;

const DrawerOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <VaulDrawer.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/80", className)} {...props} />
));
DrawerOverlay.displayName = VaulDrawer.Overlay.displayName;

const DrawerContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <VaulDrawer.Content ref={ref} className={cn("fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background", className)} {...props}>
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </VaulDrawer.Content>
  </DrawerPortal>
));
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }) => <div className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)} {...props} />;
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }) => <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />;
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef(({ className, ...props }, ref) => (
  <VaulDrawer.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DrawerTitle.displayName = VaulDrawer.Title.displayName;

const DrawerDescription = React.forwardRef(({ className, ...props }, ref) => (
  <VaulDrawer.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = VaulDrawer.Description.displayName;

export { Drawer, DrawerPortal, DrawerOverlay, DrawerTrigger, DrawerClose, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription };
