import { uniqueNamesGenerator, adjectives, animals, colors } from 'unique-names-generator';

export const generateUsername = (): string => {
  const username = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: '',
    style: 'capital',
    length: 2,
  });
  
  return username;
};

export const generateRoomId = (): string => {
  // Generate a random 6 character alphanumeric room ID
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};