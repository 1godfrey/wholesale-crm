import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { z } from "zod";
import { insertDealSchema, DealStatus } from "@shared/schema";

// Extend the schema with additional validation
const dealFormSchema = insertDealSchema.extend({
  property_address: z.string().min(3, "Address is required"),
  seller_name: z.string().min(2, "Seller name is required"),
  target_price: z.number().positive("Price must be positive").or(z.string().transform(val => val === "" ? null : Number(val))),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  square_footage: z.string().optional(),
  status: z.string().default(DealStatus.New),
});

type DealFormData = z.infer<typeof dealFormSchema>;

type DealFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DealFormData) => void;
  isSubmitting: boolean;
};

export const DealFormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting 
}: DealFormModalProps) => {
  const form = useForm<DealFormData>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      property_address: "",
      seller_name: "",
      seller_phone: "",
      seller_email: "",
      bedrooms: "",
      bathrooms: "",
      square_footage: "",
      target_price: "",
      notes: "",
      status: DealStatus.New
    }
  });
  
  const handleSubmit = (data: DealFormData) => {
    // Convert string to number for target_price
    const formattedData = {
      ...data,
      target_price: data.target_price ? Number(data.target_price) : null
    };
    onSubmit(formattedData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Deal</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="property_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="target_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Purchase Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100000" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <Input placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input placeholder="2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="square_footage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Square Footage</FormLabel>
                    <FormControl>
                      <Input placeholder="1,800" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="seller_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="seller_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="seller_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seller@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={DealStatus.New}>New</SelectItem>
                      <SelectItem value={DealStatus.Negotiating}>Negotiating</SelectItem>
                      <SelectItem value={DealStatus.UnderContract}>Under Contract</SelectItem>
                      <SelectItem value={DealStatus.Assigned}>Assigned</SelectItem>
                      <SelectItem value={DealStatus.Closed}>Closed</SelectItem>
                      <SelectItem value={DealStatus.Dead}>Dead</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any relevant notes about this deal" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Deal"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
