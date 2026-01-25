export interface Booking {
  id: string;
  mentor_id: string;
  mentee_id: string;
  session_datetime: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  communication_channels?: CommunicationChannel[];
  cancelled_at?: string;
}

export interface CommunicationChannel {
  type: 'whatsapp' | 'slack' | 'email' | 'google_meet' | 'zoom';
  handle?: string;
  is_active: boolean;
}

export interface UpdateChannelsPayload {
  channels: CommunicationChannel[];
}

export interface CancelBookingResponse {
  id: string;
  status: 'cancelled';
  refund_issued: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
