import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Document } from "@shared/schema";

export function useDocuments(dealId: string | null) {
  const queryClient = useQueryClient();
  
  // Get documents for a deal
  const { data: documents, isLoading, error } = useQuery<Document[]>({
    queryKey: [`/api/deals/${dealId}/documents`],
    enabled: !!dealId
  });
  
  // Upload a document
  const uploadDocument = useMutation({
    mutationFn: async ({ 
      filename, 
      file_type, 
      uploaded_by 
    }: { 
      filename: string; 
      file_type?: string; 
      uploaded_by?: string;
    }) => {
      if (!dealId) throw new Error("Deal ID is required");
      
      const response = await apiRequest('POST', `/api/deals/${dealId}/documents`, {
        filename,
        file_type,
        uploaded_by
      });
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/deals/${dealId}/documents`] });
    }
  });
  
  // Simulated file upload function (in a real app, would upload to S3)
  const simulateFileUpload = async (file: File, userId?: string) => {
    if (!dealId) throw new Error("Deal ID is required");
    
    // First get the upload URL
    const uploadInfo = await uploadDocument.mutateAsync({
      filename: file.name,
      file_type: file.type,
      uploaded_by: userId
    });
    
    // In a real app, we would now upload to S3 using the provided URL
    // For this demo, we'll just simulate a successful upload
    console.log(`Simulated upload of ${file.name} to ${uploadInfo.upload_url}`);
    
    return uploadInfo.document;
  };

  return {
    documents,
    isLoading,
    error,
    uploadDocument,
    simulateFileUpload
  };
}
