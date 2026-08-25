import api from "./axios";


// Acknowledge emergency

export const acknowledgeEmergency = (userId) => {
  return api.post(
    `/responder/emergency/acknowledge/${userId}`
  );
};


// Mark responding

export const markResponding = (id) => {
  return api.put(
    `/responder/emergency/responding/${id}`
  );
};


// Complete emergency

export const completeEmergency = (id, notes) => {
  return api.put(
    `/responder/emergency/complete/${id}`,
    {
      notes,
    }
  );
};


// Get my active responses

export const getMyResponses = () => {
  return api.get(
    "/responder/emergency/my"
  );
};