import { toast as hotToast } from 'react-hot-toast';
import React from 'react';

// Define the types for the options
interface ToastOptions {
    title: string;
    description?: React.ReactNode;
}

// Export the toast function
export const toast = (options: ToastOptions) => {
    hotToast(
        <div>
            <strong>{options.title}</strong>
            {options.description && <div>{options.description}</div>}
        </div>
    );
};
