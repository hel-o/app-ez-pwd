import {useState} from 'nuxt/app';

export const useUserPassword = () => {
  return useState('thePassword', () => '');
};
