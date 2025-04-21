import { v4 as uuidv4 } from 'uuid';
import {
  type User, type InsertUser,
  type Lead, type InsertLead,
  type Deal, type InsertDeal,
  type DealStatusHistory, type InsertDealStatusHistory,
  type Document, type InsertDocument
} from '@shared/schema';

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Lead methods
  getLead(id: string): Promise<Lead | undefined>;
  getLeads(): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  
  // Deal methods
  getDeal(id: string): Promise<Deal | undefined>;
  getDeals(): Promise<Deal[]>;
  getDealsByStatus(status: string): Promise<Deal[]>;
  createDeal(deal: InsertDeal): Promise<Deal>;
  updateDeal(id: string, deal: Partial<InsertDeal>): Promise<Deal | undefined>;
  
  // Status History methods
  getDealStatusHistory(dealId: string): Promise<DealStatusHistory[]>;
  createDealStatusHistory(history: InsertDealStatusHistory): Promise<DealStatusHistory>;
  
  // Document methods
  getDocuments(dealId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private leads: Map<string, Lead>;
  private deals: Map<string, Deal>;
  private statusHistory: Map<string, DealStatusHistory>;
  private documents: Map<string, Document>;

  constructor() {
    this.users = new Map();
    this.leads = new Map();
    this.deals = new Map();
    this.statusHistory = new Map();
    this.documents = new Map();
    
    // Add a default user
    const defaultUser: User = {
      user_id: uuidv4(),
      username: 'admin',
      password: 'password',
      full_name: 'John Doe',
      email: 'john@example.com',
      created_at: new Date(),
    };
    this.users.set(defaultUser.user_id, defaultUser);
    
    // Add some sample deals for development
    this.seedData(defaultUser.user_id);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = uuidv4();
    const user: User = { 
      ...insertUser, 
      user_id: id,
      created_at: new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  // Lead methods
  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }
  
  async getLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }
  
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = uuidv4();
    const lead: Lead = {
      ...insertLead,
      lead_id: id,
      created_at: new Date()
    };
    this.leads.set(id, lead);
    return lead;
  }
  
  // Deal methods
  async getDeal(id: string): Promise<Deal | undefined> {
    return this.deals.get(id);
  }
  
  async getDeals(): Promise<Deal[]> {
    return Array.from(this.deals.values());
  }
  
  async getDealsByStatus(status: string): Promise<Deal[]> {
    return Array.from(this.deals.values()).filter(
      (deal) => deal.status === status
    );
  }
  
  async createDeal(insertDeal: InsertDeal): Promise<Deal> {
    const id = uuidv4();
    const now = new Date();
    const deal: Deal = {
      ...insertDeal,
      deal_id: id,
      created_at: now,
      updated_at: now
    };
    this.deals.set(id, deal);
    
    // Create initial status history entry
    await this.createDealStatusHistory({
      deal_id: id,
      old_status: null,
      new_status: insertDeal.status || "New",
      changed_by: insertDeal.assigned_to,
      notes: "Deal created"
    });
    
    return deal;
  }
  
  async updateDeal(id: string, dealUpdate: Partial<InsertDeal>): Promise<Deal | undefined> {
    const existingDeal = this.deals.get(id);
    if (!existingDeal) return undefined;
    
    const updatedDeal: Deal = {
      ...existingDeal,
      ...dealUpdate,
      updated_at: new Date()
    };
    
    // If status changed, create a history record
    if (dealUpdate.status && dealUpdate.status !== existingDeal.status) {
      await this.createDealStatusHistory({
        deal_id: id,
        old_status: existingDeal.status,
        new_status: dealUpdate.status,
        changed_by: dealUpdate.assigned_to || existingDeal.assigned_to,
        notes: dealUpdate.notes || "Status updated"
      });
    }
    
    this.deals.set(id, updatedDeal);
    return updatedDeal;
  }
  
  // Status History methods
  async getDealStatusHistory(dealId: string): Promise<DealStatusHistory[]> {
    return Array.from(this.statusHistory.values())
      .filter((history) => history.deal_id === dealId)
      .sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
  }
  
  async createDealStatusHistory(insertHistory: InsertDealStatusHistory): Promise<DealStatusHistory> {
    const id = uuidv4();
    const history: DealStatusHistory = {
      ...insertHistory,
      history_id: id,
      timestamp: new Date()
    };
    this.statusHistory.set(id, history);
    return history;
  }
  
  // Document methods
  async getDocuments(dealId: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter((doc) => doc.deal_id === dealId)
      .sort((a, b) => {
        return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
      });
  }
  
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = uuidv4();
    const document: Document = {
      ...insertDocument,
      doc_id: id,
      uploaded_at: new Date()
    };
    this.documents.set(id, document);
    return document;
  }
  
  // Seed method to add sample data
  private seedData(userId: string) {
    // Create sample leads
    const leads = [
      {
        lead_id: uuidv4(),
        seller_name: "John Smith",
        seller_phone: "(555) 123-4567",
        seller_email: "john.smith@example.com",
        property_address: "123 Main St",
        bedrooms: "3",
        bathrooms: "2",
        square_footage: "1,800",
        notes: "Motivated seller due to relocation",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        created_by: userId
      },
      {
        lead_id: uuidv4(),
        seller_name: "Sarah Johnson",
        seller_phone: "(555) 234-5678",
        seller_email: "sarah.johnson@example.com",
        property_address: "456 Oak Ave",
        bedrooms: "4",
        bathrooms: "3",
        square_footage: "2,400",
        notes: "Property needs minor repairs",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        created_by: userId
      },
      {
        lead_id: uuidv4(),
        seller_name: "Michael Brown",
        seller_phone: "(555) 345-6789",
        seller_email: "michael.brown@example.com",
        property_address: "789 Pine Ln",
        bedrooms: "2",
        bathrooms: "1",
        square_footage: "1,200",
        notes: "Potential foreclosure",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        created_by: userId
      }
    ];
    
    // Add leads to storage
    for (const lead of leads) {
      this.leads.set(lead.lead_id, lead as Lead);
    }
    
    // Create sample deals
    const deals = [
      // New deals
      {
        deal_id: uuidv4(),
        lead_id: leads[0].lead_id,
        property_address: leads[0].property_address,
        seller_name: leads[0].seller_name,
        seller_phone: leads[0].seller_phone,
        seller_email: leads[0].seller_email,
        bedrooms: leads[0].bedrooms,
        bathrooms: leads[0].bathrooms,
        square_footage: leads[0].square_footage,
        target_price: 85000,
        assigned_price: null,
        status: "New",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        notes: leads[0].notes,
        assigned_to: userId
      },
      {
        deal_id: uuidv4(),
        lead_id: leads[1].lead_id,
        property_address: leads[1].property_address,
        seller_name: leads[1].seller_name,
        seller_phone: leads[1].seller_phone,
        seller_email: leads[1].seller_email,
        bedrooms: leads[1].bedrooms,
        bathrooms: leads[1].bathrooms,
        square_footage: leads[1].square_footage,
        target_price: 112000,
        assigned_price: null,
        status: "New",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        notes: leads[1].notes,
        assigned_to: userId
      },
      {
        deal_id: uuidv4(),
        lead_id: leads[2].lead_id,
        property_address: leads[2].property_address,
        seller_name: leads[2].seller_name,
        seller_phone: leads[2].seller_phone,
        seller_email: leads[2].seller_email,
        bedrooms: leads[2].bedrooms,
        bathrooms: leads[2].bathrooms,
        square_footage: leads[2].square_footage,
        target_price: 65000,
        assigned_price: null,
        status: "New",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        notes: leads[2].notes,
        assigned_to: userId
      },
      
      // Under Contract deals
      {
        deal_id: uuidv4(),
        lead_id: null,
        property_address: "567 Maple Dr",
        seller_name: "Emma Wilson",
        seller_phone: "(555) 456-7890",
        seller_email: "emma.wilson@example.com",
        bedrooms: "3",
        bathrooms: "2",
        square_footage: "1,950",
        target_price: 92000,
        assigned_price: 105000,
        status: "Under Contract",
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Status updated 7 days ago
        notes: "Seller is motivated due to job relocation. Property needs minor repairs (est. $5,000). Potential buyer already identified through our network.",
        assigned_to: userId
      },
      {
        deal_id: uuidv4(),
        lead_id: null,
        property_address: "890 Cedar Ct",
        seller_name: "David Lee",
        seller_phone: "(555) 567-8901",
        seller_email: "david.lee@example.com",
        bedrooms: "4",
        bathrooms: "2.5",
        square_footage: "2,100",
        target_price: 135000,
        assigned_price: 150000,
        status: "Under Contract",
        created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Status updated 10 days ago
        notes: "Property in good condition. Seller wants to close quickly.",
        assigned_to: userId
      },
      
      // Closed deals
      {
        deal_id: uuidv4(),
        lead_id: null,
        property_address: "234 Birch Rd",
        seller_name: "Jennifer Miller",
        seller_phone: "(555) 678-9012",
        seller_email: "jennifer.miller@example.com",
        bedrooms: "3",
        bathrooms: "1",
        square_footage: "1,600",
        target_price: 78500,
        assigned_price: 90800,
        status: "Closed",
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Closed 3 days ago
        notes: "Closed successfully. Profit: $12,300",
        assigned_to: userId
      },
      {
        deal_id: uuidv4(),
        lead_id: null,
        property_address: "345 Spruce Way",
        seller_name: "Robert Garcia",
        seller_phone: "(555) 789-0123",
        seller_email: "robert.garcia@example.com",
        bedrooms: "4",
        bathrooms: "3",
        square_footage: "2,300",
        target_price: 115000,
        assigned_price: 133500,
        status: "Closed",
        created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Closed 7 days ago
        notes: "Closed successfully. Profit: $18,500",
        assigned_to: userId
      }
    ];
    
    // Add deals to storage and create status history
    for (const deal of deals) {
      this.deals.set(deal.deal_id, deal as Deal);
      
      // Create initial status entry
      const initialHistory: DealStatusHistory = {
        history_id: uuidv4(),
        deal_id: deal.deal_id,
        old_status: null,
        new_status: "New",
        changed_by: userId,
        timestamp: deal.created_at,
        notes: "Deal created"
      };
      this.statusHistory.set(initialHistory.history_id, initialHistory);
      
      // If not "New" status, add the status change history
      if (deal.status !== "New") {
        const statusChangeHistory: DealStatusHistory = {
          history_id: uuidv4(),
          deal_id: deal.deal_id,
          old_status: "New",
          new_status: deal.status,
          changed_by: userId,
          timestamp: deal.updated_at,
          notes: deal.status === "Under Contract" 
            ? "Contract signed"
            : "Deal closed successfully"
        };
        this.statusHistory.set(statusChangeHistory.history_id, statusChangeHistory);
      }
      
      // Add sample documents for Under Contract and Closed deals
      if (deal.status === "Under Contract" || deal.status === "Closed") {
        const purchaseAgreement: Document = {
          doc_id: uuidv4(),
          deal_id: deal.deal_id,
          filename: "Purchase_Agreement.pdf",
          file_type: "application/pdf",
          s3_key: `contracts/${deal.deal_id}/Purchase_Agreement.pdf`,
          uploaded_by: userId,
          uploaded_at: new Date(deal.updated_at.getTime() - 2 * 24 * 60 * 60 * 1000)
        };
        this.documents.set(purchaseAgreement.doc_id, purchaseAgreement);
        
        const inspectionReport: Document = {
          doc_id: uuidv4(),
          deal_id: deal.deal_id,
          filename: "Property_Inspection.pdf",
          file_type: "application/pdf",
          s3_key: `contracts/${deal.deal_id}/Property_Inspection.pdf`,
          uploaded_by: userId,
          uploaded_at: new Date(deal.updated_at.getTime() - 1 * 24 * 60 * 60 * 1000)
        };
        this.documents.set(inspectionReport.doc_id, inspectionReport);
      }
    }
  }
}

export const storage = new MemStorage();
