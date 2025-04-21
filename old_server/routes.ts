// import express, { type Express, Request, Response } from "express";
// import { createServer, type Server } from "http";
// import { storage } from "./storage";
// import { 
//   insertDealSchema, 
//   insertDealStatusHistorySchema, 
//   insertDocumentSchema,
//   insertLeadSchema
// } from "@shared/schema";

// export async function registerRoutes(app: Express): Promise<Server> {
//   const router = express.Router();

//   // Get all deals
//   router.get("/deals", async (req: Request, res: Response) => {
//     try {
//       const status = req.query.status as string | undefined;
//       let deals;
      
//       if (status) {
//         deals = await storage.getDealsByStatus(status);
//       } else {
//         deals = await storage.getDeals();
//       }
      
//       res.json(deals);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching deals", error });
//     }
//   });

//   // Get a single deal
//   router.get("/deals/:id", async (req: Request, res: Response) => {
//     try {
//       const deal = await storage.getDeal(req.params.id);
//       if (!deal) {
//         return res.status(404).json({ message: "Deal not found" });
//       }
//       res.json(deal);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching deal", error });
//     }
//   });

//   // Create a deal
//   router.post("/deals", async (req: Request, res: Response) => {
//     try {
//       const validatedData = insertDealSchema.parse(req.body);
//       const deal = await storage.createDeal(validatedData);
//       res.status(201).json(deal);
//     } catch (error) {
//       res.status(400).json({ message: "Invalid deal data", error });
//     }
//   });

//   // Update a deal
//   router.patch("/deals/:id", async (req: Request, res: Response) => {
//     try {
//       const deal = await storage.getDeal(req.params.id);
//       if (!deal) {
//         return res.status(404).json({ message: "Deal not found" });
//       }
      
//       const validatedData = insertDealSchema.partial().parse(req.body);
//       const updatedDeal = await storage.updateDeal(req.params.id, validatedData);
//       res.json(updatedDeal);
//     } catch (error) {
//       res.status(400).json({ message: "Invalid deal data", error });
//     }
//   });

//   // Update deal status with history
//   router.post("/deals/:id/status", async (req: Request, res: Response) => {
//     try {
//       const deal = await storage.getDeal(req.params.id);
//       if (!deal) {
//         return res.status(404).json({ message: "Deal not found" });
//       }
      
//       const { status, notes, changed_by } = req.body;
//       if (!status) {
//         return res.status(400).json({ message: "Status is required" });
//       }
      
//       // Update the deal with new status
//       const updatedDeal = await storage.updateDeal(req.params.id, { 
//         status, 
//         notes: notes || deal.notes, 
//       });
      
//       // Create status history entry
//       const historyData = {
//         deal_id: req.params.id,
//         old_status: deal.status,
//         new_status: status,
//         changed_by,
//         notes: notes || `Changed status from ${deal.status} to ${status}`
//       };
//       const validatedHistory = insertDealStatusHistorySchema.parse(historyData);
//       await storage.createDealStatusHistory(validatedHistory);
      
//       res.json(updatedDeal);
//     } catch (error) {
//       res.status(400).json({ message: "Error updating status", error });
//     }
//   });

//   // Get status history for a deal
//   router.get("/deals/:id/history", async (req: Request, res: Response) => {
//     try {
//       const deal = await storage.getDeal(req.params.id);
//       if (!deal) {
//         return res.status(404).json({ message: "Deal not found" });
//       }
      
//       const history = await storage.getDealStatusHistory(req.params.id);
//       res.json(history);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching history", error });
//     }
//   });

//   // Get documents for a deal
//   router.get("/deals/:id/documents", async (req: Request, res: Response) => {
//     try {
//       const deal = await storage.getDeal(req.params.id);
//       if (!deal) {
//         return res.status(404).json({ message: "Deal not found" });
//       }
      
//       const documents = await storage.getDocuments(req.params.id);
//       res.json(documents);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching documents", error });
//     }
//   });

//   // Create/upload a document 
//   router.post("/deals/:id/documents", async (req: Request, res: Response) => {
//     try {
//       const deal = await storage.getDeal(req.params.id);
//       if (!deal) {
//         return res.status(404).json({ message: "Deal not found" });
//       }
      
//       const { filename, file_type, uploaded_by } = req.body;
//       if (!filename) {
//         return res.status(400).json({ message: "Filename is required" });
//       }
      
//       // In a real S3 implementation, we would generate a pre-signed URL here
//       // For this demo, we'll simulate the upload completion
//       const s3_key = `contracts/${req.params.id}/${filename}`;
      
//       const documentData = {
//         deal_id: req.params.id,
//         filename,
//         file_type: file_type || 'application/pdf',
//         s3_key,
//         uploaded_by
//       };
      
//       const validatedDocument = insertDocumentSchema.parse(documentData);
//       const document = await storage.createDocument(validatedDocument);
      
//       res.status(201).json({
//         document,
//         upload_url: `/api/upload/${s3_key}` // Simulated presigned URL
//       });
//     } catch (error) {
//       res.status(400).json({ message: "Error creating document", error });
//     }
//   });

//   // Get all leads
//   router.get("/leads", async (_req: Request, res: Response) => {
//     try {
//       const leads = await storage.getLeads();
//       res.json(leads);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching leads", error });
//     }
//   });

//   // Get a single lead
//   router.get("/leads/:id", async (req: Request, res: Response) => {
//     try {
//       const lead = await storage.getLead(req.params.id);
//       if (!lead) {
//         return res.status(404).json({ message: "Lead not found" });
//       }
//       res.json(lead);
//     } catch (error) {
//       res.status(500).json({ message: "Error fetching lead", error });
//     }
//   });

//   // Create a lead
//   router.post("/leads", async (req: Request, res: Response) => {
//     try {
//       const validatedData = insertLeadSchema.parse(req.body);
//       const lead = await storage.createLead(validatedData);
//       res.status(201).json(lead);
//     } catch (error) {
//       res.status(400).json({ message: "Invalid lead data", error });
//     }
//   });

//   // Simulated file upload endpoint (in a real app, this would be handled by S3 directly)
//   router.post("/upload/:dealId/:filename", (req: Request, res: Response) => {
//     // In a real implementation, the file would be uploaded directly to S3
//     // This is just a mock endpoint for demonstration
//     res.status(200).json({ message: "File uploaded successfully" });
//   });

//   // Register routes with /api prefix
//   app.use('/api', router);

//   const httpServer = createServer(app);
//   return httpServer;
// }
