import { Toaster } from '../ui/toast';

export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
};
