import { authService } from './authService';

export const userService = {
  getProfile: () => authService.getProfile(),
};
