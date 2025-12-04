"use client";
import { toast as reactToast } from 'react-toastify'

interface IToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

export const toast = ({ title, description, variant = 'default' }: IToastProps) => {
  switch (variant) {
    case "success":
    case "default":
      return reactToast.success(title)
    case "destructive":
      return reactToast.error(title)
    case "warning":
      return reactToast.warning(title)
    default:
      return reactToast.info(title)
  }
};

export const useToast = () => {
  return {
    toast,
    dismiss: reactToast.dismiss
  };
};