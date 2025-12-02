"use client";
import { toast as hotToast, Toast } from "react-hot-toast";
import { CheckCircle, AlertCircle, XCircle, Info } from "lucide-react";

interface IToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
}

const getIcon = (variant: IToastProps['variant']) => {
  switch (variant) {
    case 'success':
      return <CheckCircle className="h-10 w-10 text-green-500" />;
    case 'destructive':
      return <XCircle className="h-10 w-10 text-red-500" />;
    case 'warning':
      return <AlertCircle className="h-10 w-10 text-yellow-500" />;
    default:
      return <Info className="h-10 w-10 text-blue-500" />;
  }
};

export const toast = ({ title, description, variant = 'default' }: IToastProps) => {
  return hotToast.custom((t: Toast) => (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4" >
        <div className="flex items-start" >
          <div className="flex-shrink-0 pt-0.5" >
            {getIcon(variant)}
          </div>
          < div className="ml-3 flex-1" >
            <p className="text-sm font-medium text-gray-900" >
              {title}
            </p>
            < p className="mt-1 text-sm text-gray-500" >
              {description}
            </p>
          </div>
        </div>
      </div>
      < div className="flex border-l border-gray-200" >
        <button
          onClick={() => hotToast.dismiss(t.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Close
        </button>
      </div>
    </div>
  ));
};

export const useToast = () => {
  return {
    toast,
    dismiss: hotToast.dismiss
  };
};