import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const generateFlashcards = async (topic) => {
  const response = await axios.post(`${API_BASE_URL}/generate_flashcards`, { topic, n: 3 });
  return response.data; // The new endpoint returns the array directly
};

export const getFlashcards = async () => {
  const response = await axios.get(`${API_BASE_URL}/flashcards`);
  return response.data;
};

export const createFlashcard = async (question, answer, topic = 'General') => {
  const response = await axios.post(`${API_BASE_URL}/flashcards`, { question, answer, topic });
  return response.data;
};

export const updateFlashcard = async (id, question, answer, topic = 'General') => {
  const response = await axios.put(`${API_BASE_URL}/flashcards/${id}`, { question, answer, topic });
  return response.data;
};

export const deleteFlashcard = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/flashcards/${id}`);
  return response.data;
};
