import { AlertCircle, CheckCircle, Info } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'info';

interface AlertModalProps {
  isOpen: boolean;
  type?: AlertType;
  title: string;
  message: string;
  onConfirm: () => void;
  confirmText?: string;
}

export function AlertModal({ 
  isOpen, 
  type = 'info', 
  title, 
  message, 
  onConfirm, 
  confirmText = '확인' 
}: AlertModalProps) {
  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle className="w-12 h-12 text-green-500" />,
    error: <AlertCircle className="w-12 h-12 text-red-500" />,
    info: <Info className="w-12 h-12 text-blue-500" />
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up p-6 text-center space-y-4">
        <div className="flex justify-center">
          {icons[type]}
        </div>
        
        <div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{message}</p>
        </div>

        <button
          onClick={onConfirm}
          className={`w-full py-3 mt-2 text-white font-bold rounded-xl transition-colors ${
            type === 'success' ? 'bg-green-500 hover:bg-green-600' :
            type === 'error' ? 'bg-red-500 hover:bg-red-600' :
            'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
