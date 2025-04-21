import { Request, Response } from 'express';
import { pool } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { generatePresignedUrl } from '../services/s3';

export const dealsController = {
  getDeals: async (req: Request, res: Response) => {
    try {
      const { status } = req.query;
      let query = 'SELECT * FROM deals';
      const params = [];

      if (status) {
        query += ' WHERE status = $1';
        params.push(status);
      }

      const { rows } = await pool.query(query, params);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch deals' });
    }
  },

  createDeal: async (req: Request, res: Response) => {
    try {
      const dealId = uuidv4();
      const { lead_id, property_address, seller_name, seller_phone, status, target_price, assigned_to } = req.body;

      await pool.query(
        `INSERT INTO deals 
        (deal_id, lead_id, property_address, seller_name, seller_phone, status, target_price, assigned_to)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [dealId, lead_id, property_address, seller_name, seller_phone, status || 'New', target_price, assigned_to]
      );

      // Create initial status history
      await pool.query(
        `INSERT INTO deal_status_history 
        (history_id, deal_id, old_status, new_status, changed_by, notes)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), dealId, null, status || 'New', assigned_to, 'Deal created']
      );

      res.status(201).json({ deal_id: dealId });
    } catch (error) {
      res.status(400).json({ error: 'Failed to create deal' });
    }
  },

  updateDealStatus: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status, notes, changed_by } = req.body;

      // Get current status
      const { rows } = await pool.query('SELECT status FROM deals WHERE deal_id = $1', [id]);
      const oldStatus = rows[0]?.status;

      // Update deal
      await pool.query(
        'UPDATE deals SET status = $1, updated_at = NOW() WHERE deal_id = $2',
        [status, id]
      );

      // Log status change
      await pool.query(
        `INSERT INTO deal_status_history 
        (history_id, deal_id, old_status, new_status, changed_by, notes)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [uuidv4(), id, oldStatus, status, changed_by, notes || `Status changed to ${status}`]
      );

      res.json({ message: 'Status updated' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to update status' });
    }
  },

  createDealDocument: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { filename, file_type, uploaded_by } = req.body;
      const docId = uuidv4();
      const s3Key = `contracts/${id}/${filename}`;

      // Generate presigned URL for upload
      const uploadUrl = await generatePresignedUrl(s3Key, file_type);

      // Store document metadata
      await pool.query(
        `INSERT INTO documents 
        (doc_id, deal_id, filename, file_type, s3_key, uploaded_by)
        VALUES ($1, $2, $3, $4, $5, $6)`,
        [docId, id, filename, file_type, s3Key, uploaded_by]
      );

      res.json({
        document_id: docId,
        upload_url: uploadUrl
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create document' });
    }
  }
};